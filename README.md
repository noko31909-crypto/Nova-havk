# Glacial CoolTile — AI Heat Island Planner

A NovaHack 2024 project that turns Kazakhstan's glacial flour (waste water sludge) problem into a city-cooling solution: geopolymer cooling tiles, planned with a transparent AI-driven heat island formula for Almaty districts.

## What's inside

**The transparent Climate Rating formula** (never a black box):

```
Climate_Rating = 0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)
```

Each input is normalized to a 0–1 scale and weighted: surface temperature (0.4), sealed road area ratio (0.3), population density (0.2) and solar insolation (0.1). Grades A–F map rating bands to tile deployment priority, and ROI / payback figures scale with the rating using published geopolymer tile performance data.

## Screens

| Route | Purpose |
|---|---|
| `/` | Landing page: glacial flour problem, geopolymer tile solution, CTA into the Planner |
| `/planner` | AI Heat Island Planner: transparent formula, manual inputs per variable, 3 district presets, results with grade, recommended tile area (m²), 10-yr ROI and payback |
| `/map` | Demo Map: side-by-side comparison of Alatau, Bostandyk and Almaly districts with formula weights and methodology |

Every results view carries a **PROJECTED DATA** disclaimer — all Almaty district figures are illustrative, field validation is Phase 2.

## Tech stack

React 19 + Tailwind 4 + Vite on the client; Express 4 + tRPC 11 on the server; Vitest for tests.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/trpc/health` | GET | Health check (`status: ok`) |
| `/api/trpc/heatIsland.analyze` | POST | Analyze a custom heat island scenario |
| `/api/trpc/heatIsland.analyzeByDistrict` | GET | Analyze a pre-analyzed Almaty district |
| `/api/trpc/heatIsland.demoDistricts` | GET | List the 3 demo districts |
| `/api/trpc/getAlmatyDistricts` | GET | `get-almaty-districts` (API spec alias) |

Core logic lives in `server/logic/heatCalculator.ts`; UI pages are in `client/src/pages/`.

## Local development

```bash
pnpm install
pnpm dev        # development server
pnpm build      # production build (client → dist/public, server → dist/index.js)
pnpm start      # run production build
pnpm test       # vitest
pnpm check      # TypeScript
```

## Deploy to Vercel

Vercel settings for a seamless import of this repository:

| Setting | Value |
|---|---|
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |
| Runtime | Node.js 22.x (no custom runtime needed) |

The server bundles into `dist/index.js` and Express serves both the tRPC API (`/api/trpc/*`) and the SPA from the same process, so a single Node entry covers the whole site — no separate API routes required. Environment variables required by the template (e.g. `JWT_SECRET`, `OAUTH_SERVER_URL`) are injected automatically in a Node environment; no custom values are required for this demo.

One click alternative: `vercel --prod` with the same build settings picked up from `vercel.json`.

## Disclaimer

All district data, ROI and payback figures shown in the app are **projected/illustrative**. The underlying geopolymer performance research is real; Almaty measurements are planned as Phase 2 field validation.
