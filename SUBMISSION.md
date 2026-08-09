# Submission Checklist — NovaHack 2024 (Glacial CoolTile)

## Requirements coverage

| Requirement | Status | Where |
|---|---|---|
| Landing page: problem + solution + CTA to AI Planner | Done | `/` (`client/src/pages/Home.tsx`) |
| AI Heat Island Planner screen | Done | `/planner` (`client/src/pages/Planner.tsx`) |
| Transparent formula displayed exactly as `0.4×T/50 + 0.3×Road_Ratio + 0.2×Density/5000 + 0.1×Solar/1500` | Done | Planner header + hero card on landing |
| Manual input fields for each variable | Done | Planner sliders + number fields |
| District presets (3 Almaty districts) | Done | Alatau / Bostandyk / Almaly presets |
| Results: grade A–F, recommended area m², ROI, payback | Done | Planner results panel |
| "PROJECTED DATA" disclaimer on all results views | Done | `ProjectedDataBadge` on Planner, Demo Map table, Demo Map card |
| Demo Map: 3 pre-analyzed districts incl. Almaty | Done | `/map` (`client/src/pages/DemoMap.tsx`) |
| Formula weights + methodology section | Done | Demo Map explainer cards |
| Backend: health check | Done | `/api/trpc/health` |
| Backend: analyze-heat-island (POST) | Done | `/api/trpc/heatIsland.analyze` |
| Backend: get-almaty-districts (GET) | Done | `/api/trpc/getAlmatyDistricts` (+ `demoDistricts`) |
| GitHub repository | Done | https://github.com/noko31909-crypto/Nova-havk |
| Vercel deployment pipeline | Done | `vercel.json` + README/SETUP instructions |
| Tests | Done | 11 vitest tests (calculator + procedures) |

## Deployment

Vercel import settings are picked up automatically from `vercel.json` (build: `pnpm build`, output: `dist`). See `SETUP.md` for the exact steps.

## Live preview (while Vercel import is pending)

The project is also hosted on Manus with a Publish button in the top-right of the panel; clicking it produces a permanent public URL in seconds as a fallback for the demo.

## Files of interest for the jury

`server/logic/heatCalculator.ts` — the transparent scoring engine. `client/src/pages/Planner.tsx` — the interactive demo. `server/heatCalculator.test.ts` — tests proving the formula implementation.
