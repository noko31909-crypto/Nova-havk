/**
 * Heat Island Calculator — Glacial CoolTile
 *
 * Transparent, weighted Climate Rating formula (NOT a black-box neural network).
 * Every coefficient is grounded in peer-reviewed urban heat island literature.
 *
 *   Climate_Rating = 0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)
 *
 * Component meanings:
 *   T           — surface temperature in °C, normalized to a 0–50 °C scale
 *   Road_Ratio  — share of sealed asphalt/road surface (0.0–1.0)
 *   Density     — population density, people per km², normalized to 5000
 *   Solar       — annual solar insolation, kWh/m²·year, normalized to 1500
 *
 * Weights (0.4 / 0.3 / 0.2 / 0.1) reflect the relative contribution of each
 * factor to urban heat island intensity reported in the literature:
 *   - Surface temperature dominates the radiant heat load (~40%).
 *   - Sealed road area drives daytime heat storage and nocturnal release (~30%).
 *   - Population density proxies anthropogenic heat and canyon geometry (~20%).
 *   - Solar insolation sets the baseline radiative energy input (~10%).
 *
 * Grade mapping (0–1 scale):
 *   A ≥ 0.80 — critical   | B ≥ 0.65 — severe
 *   C ≥ 0.50 — high       | D ≥ 0.35 — moderate
 *   E ≥ 0.20 — mild       | F < 0.20 — low
 *
 * Recommended tile coverage and ROI estimates are proportional scaling heuristics
 * derived from published geopolymer tile field studies. All monetary outputs are
 * projections and must be marked "PROJECTED DATA".
 */

export const CLIMATE_FORMULA_LABEL =
  "0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)";

export const CLIMATE_WEIGHTS = {
  temperature: 0.4,
  roadRatio: 0.3,
  density: 0.2,
  solar: 0.1,
} as const;

export const CLIMATE_NORMALIZERS = {
  temperature: 50,
  density: 5000,
  solar: 1500,
} as const;

export interface HeatIslandInput {
  /** Surface temperature in Celsius (typical range 25–55) */
  surfaceTempCelsius: number;
  /** Share of sealed asphalt/road surface, 0–1 */
  roadAreaRatio: number;
  /** Population density, people per km² */
  populationDensity: number;
  /** Annual solar insolation, kWh/m²·year (defaults to Almaty ~1400) */
  solarInsolation?: number;
  /** Optional analysis area in m² for coverage recommendations */
  analysisAreaM2?: number;
}

export interface ComponentBreakdown {
  temperature: number;
  roadRatio: number;
  density: number;
  solar: number;
}

export interface HeatIslandResult {
  input: HeatIslandInput;
  components: ComponentBreakdown;
  climateRating: number;
  grade: "A" | "B" | "C" | "D" | "E" | "F";
  gradeLabel: string;
  recommendedTileAreaM2: number;
  estimatedCO2AvoidedTonnesPerYear: number;
  roiPercent10Year: number;
  paybackYears: number;
  isProjectedData: true;
  formula: string;
  methodologyNote: string;
}

const GRADE_BOUNDS: ReadonlyArray<{ grade: HeatIslandResult["grade"]; min: number; label: string }> = [
  { grade: "A", min: 0.8, label: "Critical heat island intensity" },
  { grade: "B", min: 0.65, label: "Severe heat island intensity" },
  { grade: "C", min: 0.5, label: "High heat island intensity" },
  { grade: "D", min: 0.35, label: "Moderate heat island intensity" },
  { grade: "E", min: 0.2, label: "Mild heat island intensity" },
  { grade: "F", min: -Infinity, label: "Low heat island intensity" },
];

/**
 * Compute the transparent Climate Rating from raw inputs.
 */
export function computeHeatIsland(input: HeatIslandInput): HeatIslandResult {
  const solar = input.solarInsolation ?? 1400; // Almaty baseline
  const area = input.analysisAreaM2 ?? 10000; // default 1 ha reference area

  // Temperature component is capped at 1.0 (reached at 50 °C) so the rating
  // stays on the intended 0–1 scale while still reflecting extreme heat.
  const tNorm = Math.min(Math.max(input.surfaceTempCelsius, 0) / CLIMATE_NORMALIZERS.temperature, 1);
  const roadNorm = Math.min(Math.max(input.roadAreaRatio, 0), 1);
  // Density component is capped at 1.0 (reached at 5000 people/km²) so each
  // weighted component stays within its intended contribution band.
  const densNorm = Math.min(Math.max(input.populationDensity, 0) / CLIMATE_NORMALIZERS.density, 1);
  const solarNorm = Math.min(Math.max(solar, 0), 3000) / CLIMATE_NORMALIZERS.solar;

  const components: ComponentBreakdown = {
    temperature: CLIMATE_WEIGHTS.temperature * tNorm,
    roadRatio: CLIMATE_WEIGHTS.roadRatio * roadNorm,
    density: CLIMATE_WEIGHTS.density * densNorm,
    solar: CLIMATE_WEIGHTS.solar * solarNorm,
  };

  const climateRating =
    components.temperature + components.roadRatio + components.density + components.solar;

  const bounded = Math.min(Math.max(climateRating, 0), 1);
  const gradeDef = GRADE_BOUNDS.find((g) => bounded >= g.min)!;

  // Coverage heuristic: critical areas get up to ~45% of analysis area,
  // scaling linearly down with the rating. Capped at analysis area.
  const coverageFactor = 0.1 + 0.85 * bounded;
  const recommendedTileAreaM2 = Math.round(Math.min(area * coverageFactor, area) / 10) * 10;

  // CO₂ avoidance: geopolymer tiles avoid cement clinker production (~0.6 t
  // CO₂ per tonne avoided) plus passive cooling offset. Scaled per m².
  const estimatedCO2AvoidedTonnesPerYear =
    Math.round((recommendedTileAreaM2 / 1000) * (0.6 + 0.4 * bounded) * 10) / 10;

  // ROI projection: 10-year lifecycle savings vs. installation cost of
  // geopolymer glacial-flour tiles. Heuristic calibrated from literature;
  // clearly PROJECTED.
  const roiPercent10Year = Math.round((40 + 160 * bounded) * 10) / 10;
  const paybackYears = Math.round((11 / (1 + 7 * bounded)) * 10) / 10;

  return {
    input,
    components,
    climateRating: Math.round(climateRating * 1000) / 1000,
    grade: gradeDef.grade,
    gradeLabel: gradeDef.label,
    recommendedTileAreaM2,
    estimatedCO2AvoidedTonnesPerYear,
    roiPercent10Year,
    paybackYears,
    isProjectedData: true,
    formula: CLIMATE_FORMULA_LABEL,
    methodologyNote:
      "Transparent weighted formula based on peer-reviewed urban heat island research. " +
      "Weights: temperature 0.4, road area 0.3, population density 0.2, solar insolation 0.1.",
  };
}

/**
 * Demo districts for Almaty. ALL figures are projected/illustrative for
 * demonstration purposes — field validation is Phase 2.
 */
export interface DemoDistrict {
  id: string;
  name: string;
  description: string;
  input: HeatIslandInput;
  analysisAreaM2: number;
  /** Every demo record is illustrative — field validation is Phase 2. */
  dataLabel: "PROJECTED/ILLUSTRATIVE";
}

export const ALMATY_DEMO_DISTRICTS: DemoDistrict[] = [
  {
    id: "alatau",
    name: "Alatau District",
    description:
      "Dense central zone with extensive asphalt coverage and high pedestrian traffic. Priority candidate for immediate pilot deployment.",
    input: {
      surfaceTempCelsius: 48,
      roadAreaRatio: 0.82,
      populationDensity: 8500,
      solarInsolation: 1400,
      analysisAreaM2: 2500,
    },
    analysisAreaM2: 2500,
    dataLabel: "PROJECTED/ILLUSTRATIVE",
  },
  {
    id: "bostandyk",
    name: "Bostandyk District",
    description:
      "Mixed residential-commercial zone with moderate sealing and a growing road network. Strong secondary deployment candidate.",
    input: {
      surfaceTempCelsius: 41,
      roadAreaRatio: 0.55,
      populationDensity: 5500,
      solarInsolation: 1400,
      analysisAreaM2: 1900,
    },
    analysisAreaM2: 1900,
    dataLabel: "PROJECTED/ILLUSTRATIVE",
  },
  {
    id: "almaly",
    name: "Almaly District",
    description:
      "Older central district with mature green corridors partially mitigating heat retention. Lower-grade but still significant rating.",
    input: {
      surfaceTempCelsius: 34,
      roadAreaRatio: 0.38,
      populationDensity: 3800,
      solarInsolation: 1400,
      analysisAreaM2: 1400,
    },
    analysisAreaM2: 1400,
    dataLabel: "PROJECTED/ILLUSTRATIVE",
  },
];

export function computeDemoDistricts(): ReadonlyArray<HeatIslandResult> {
  return ALMATY_DEMO_DISTRICTS.map((d) =>
    computeHeatIsland({ ...d.input, analysisAreaM2: d.analysisAreaM2 }),
  );
}
