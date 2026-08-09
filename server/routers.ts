import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import {
  ALMATY_DEMO_DISTRICTS,
  computeHeatIsland,
  type HeatIslandInput,
} from "./logic/heatCalculator";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  health: publicProcedure.query(() => ({
    status: "ok",
    service: "glacial-cooltile",
    timestamp: Date.now(),
  })),

  heatIsland: router({
    analyze: publicProcedure
      .input(
        z.object({
          surfaceTempCelsius: z.number().min(0).max(100),
          roadAreaRatio: z.number().min(0).max(1),
          populationDensity: z.number().min(0).max(50000),
          solarInsolation: z.number().min(0).max(3000).optional(),
          analysisAreaM2: z.number().min(100).max(1000000).optional(),
        }),
      )
      .mutation(({ input }) => {
        const safeInput: HeatIslandInput = {
          surfaceTempCelsius: input.surfaceTempCelsius,
          roadAreaRatio: input.roadAreaRatio,
          populationDensity: input.populationDensity,
          solarInsolation: input.solarInsolation,
          analysisAreaM2: input.analysisAreaM2,
        };
        return computeHeatIsland(safeInput);
      }),
    analyzeByDistrict: publicProcedure
      .input(z.object({ districtId: z.string().min(1) }))
      .query(({ input }) => {
        const district = ALMATY_DEMO_DISTRICTS.find((d) => d.id === input.districtId);
        if (!district) {
          throw new Error(`Unknown district: ${input.districtId}`);
        }
        return computeHeatIsland({ ...district.input, analysisAreaM2: district.analysisAreaM2 });
      }),
    demoDistricts: publicProcedure.query(() => ALMATY_DEMO_DISTRICTS),
  }),

  /** Public endpoint matching the API spec: GET get-almaty-districts */
  getAlmatyDistricts: publicProcedure.query(() => ALMATY_DEMO_DISTRICTS),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
