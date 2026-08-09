# Progress notes — Glacial CoolTile (internal)

## Status
- Project: /home/ubuntu/glacial-cooltile (webdev, features: db, server, user; tRPC template)
- User repo target: https://github.com/noko31909-crypto/Nova-havk (empty, user provided URL; gh CLI authorized as noko31909-crypto)
- Checkpoint saved: c43ba0c1 (before vercel config). Latest functional checkpoint to reference if needed.
- Production build verified locally: `pnpm build` → dist/index.js + dist/public; `NODE_ENV=production node dist/index.js` serves API + SPA correctly (tested on port 4100, killed after).

## Key implementation
- server/logic/heatCalculator.ts — transparent formula 0.4×(T/50)+0.3×Road+0.2×(Density/5000)+0.1×(Solar/1500), grades A–F, demo districts alatau(48/0.82/8500, rating .923=A, area 2500 m²)/bostandyk(41/0.55/5500, .786=B, 1900)/almaly(34/0.38/3800, .631=C, 1400); every record dataLabel="PROJECTED/ILLUSTRATIVE".
- server/routers.ts — health, heatIsland.analyze (mutation), heatIsland.analyzeByDistrict (query), heatIsland.demoDistricts, getAlmatyDistricts.
- client/src/pages/Home.tsx (landing), Planner.tsx (inputs sliders + presets + results with PROJECTED DATA badge), DemoMap.tsx (SVG map + comparison table + weights + methodology, error/loading states).
- Shared UI: client/src/components/site.tsx (SiteNav, SiteFooter, ProjectedDataBadge, GradeChip).
- Theme: ice-blue glacier light theme, Inter + Libre Baskerville (index.css, index.html fonts linked).
- server/heatCalculator.test.ts — 11 passing vitest tests.

## Vercel config (vercel.json at root)
- framework: null, buildCommand: pnpm build, outputDirectory: dist, installCommand: pnpm install.
- Rewrites: /api/:path* → /api; /(.*) → /index.html (SPA).
- server/_core/vite.ts patched: in production prefers <bundle-dir>/public (works on Vercel where dist/index.js sits next to dist/public).
- NOTE: Vercel serverless functions for /api rewrite need an api/ entry; since outputDirectory=dist and index.js serves express at /, rewrites send /api/* to dist/index.js — Vercel matches rewrite destination against output files, so destination "/api" may fail. ALTERNATIVE working approach used by default template hosting: single entry handles all. If rewrites fail, user can import on Vercel with Build Cmd "pnpm build", Output "dist", Install Cmd "pnpm install" and the start command must be `node dist/index.js` (Vercel auto-detects via engines or we add "engines":{"node":">=20"} + start script).

## Remaining TODO
- Push code to https://github.com/noko31909-crypto/Nova-havk with meaningful commits (init commit with docs + code).
- Verify vercel.json works; document Vercel import settings (build cmd, output dir, PORT env not needed — code reads PORT).
- Mark todo.md items complete; deliver checkpoint + instructions.
- User message plan: explain deployment on Vercel (user clicks Import on Vercel, repo Nova-havk, root dir repo root, build cmd pnpm build, output dist). Also remind user Manus publishing via Publish button as alternative.
