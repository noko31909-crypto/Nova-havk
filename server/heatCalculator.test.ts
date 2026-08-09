import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import {
  ALMATY_DEMO_DISTRICTS,
  CLIMATE_FORMULA_LABEL,
  computeHeatIsland,
} from "./logic/heatCalculator";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("heatCalculator", () => {
  it("computes grade A for the Alatau demo profile (48°C, 0.82 roads, 8500/km²)", () => {
    const result = computeHeatIsland({
      surfaceTempCelsius: 48,
      roadAreaRatio: 0.82,
      populationDensity: 8500,
      solarInsolation: 1400,
      analysisAreaM2: 2500,
    });

    // Manual check of the transparent formula (density also capped at 1):
    // 0.4×(48/50) + 0.3×0.82 + 0.2×min(8500/5000,1) + 0.1×(1400/1500)
    const expected =
      0.4 * (48 / 50) + 0.3 * 0.82 + 0.2 * Math.min(8500 / 5000, 1) + 0.1 * (1400 / 1500);
    expect(result.climateRating).toBeCloseTo(expected, 3);
    expect(result.grade).toBe("A");
    expect(result.isProjectedData).toBe(true);
    expect(result.formula).toBe(CLIMATE_FORMULA_LABEL);
    expect(result.recommendedTileAreaM2).toBeGreaterThan(0);
    expect(result.recommendedTileAreaM2).toBeLessThanOrEqual(2500);
  });

  it("exposes the exact transparent formula string", () => {
    expect(CLIMATE_FORMULA_LABEL).toBe(
      "0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)",
    );
  });

  it("assigns lower grades to milder profiles and keeps weights additive", () => {
    const mild = computeHeatIsland({
      surfaceTempCelsius: 35,
      roadAreaRatio: 0.3,
      populationDensity: 2000,
      solarInsolation: 1200,
    });
    expect(["C", "D", "E", "F"]).toContain(mild.grade);
    const sum =
      mild.components.temperature +
      mild.components.roadRatio +
      mild.components.density +
      mild.components.solar;
    expect(mild.climateRating).toBeCloseTo(sum, 6);
  });

  it("clamps out-of-range inputs", () => {
    const extreme = computeHeatIsland({
      surfaceTempCelsius: 200,
      roadAreaRatio: 5,
      populationDensity: -100,
      solarInsolation: -50,
    });
    expect(extreme.climateRating).toBeGreaterThanOrEqual(0);
    expect(extreme.climateRating).toBeLessThanOrEqual(1);
  });

  it("has exactly 3 Almaty demo districts including Alatau, Bostandyk, Almaly", () => {
    expect(ALMATY_DEMO_DISTRICTS).toHaveLength(3);
    const ids = ALMATY_DEMO_DISTRICTS.map((d) => d.id);
    expect(ids).toContain("alatau");
    expect(ids).toContain("bostandyk");
    expect(ids).toContain("almaly");
    for (const d of ALMATY_DEMO_DISTRICTS) {
      expect(d.input.surfaceTempCelsius).toBeGreaterThan(0);
      expect(d.input.roadAreaRatio).toBeGreaterThan(0);
      expect(d.input.populationDensity).toBeGreaterThan(0);
      expect(d.dataLabel).toBe("PROJECTED/ILLUSTRATIVE");
    }
  });
});

describe("heatIsland tRPC procedures", () => {
  const caller = appRouter.createCaller(publicContext());

  it("health check returns ok", async () => {
    const result = await caller.health();
    expect(result.status).toBe("ok");
  });

  it("analyze computes the Alatau profile end-to-end", async () => {
    const result = await caller.heatIsland.analyze({
      surfaceTempCelsius: 48,
      roadAreaRatio: 0.82,
      populationDensity: 8500,
      solarInsolation: 1400,
      analysisAreaM2: 2500,
    });
    expect(result.grade).toBe("A");
    expect(result.paybackYears).toBeGreaterThan(0);
    expect(result.roiPercent10Year).toBeGreaterThan(0);
  });

  it("analyzeByDistrict returns results for alatau and rejects unknown ids", async () => {
    const result = await caller.heatIsland.analyzeByDistrict({ districtId: "alatau" });
    expect(result.grade).toBe("A");
    await expect(
      caller.heatIsland.analyzeByDistrict({ districtId: "nonexistent" }),
    ).rejects.toThrow();
  });

  it("demoDistricts returns the 3 Almaty districts", async () => {
    const result = await caller.heatIsland.demoDistricts();
    expect(result).toHaveLength(3);
  });

  it("getAlmatyDistricts exposes the projected-data marker on every record", async () => {
    const result = await caller.getAlmatyDistricts();
    expect(result).toHaveLength(3);
    for (const d of result) {
      expect(d.dataLabel).toBe("PROJECTED/ILLUSTRATIVE");
    }
  });
});
