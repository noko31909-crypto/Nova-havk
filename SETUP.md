# Setup & Deployment Guide

## Local development

```bash
pnpm install
pnpm dev        # starts the dev server at http://localhost:3000
pnpm test       # run vitest suite
pnpm check      # TypeScript type check
```

The app has three screens: `/` (landing), `/planner` (AI Heat Island Planner) and `/map` (Demo Map). All API calls go through tRPC under `/api/trpc`.

## Production build

`pnpm build` produces `dist/public` (client) and `dist/index.js` (server). The single Express process serves both the API and the SPA:

```bash
pnpm build
NODE_ENV=production node dist/index.js
```

The server picks up the port from the `PORT` environment variable, which every hosting platform provides automatically.

## Deploy to Vercel (recommended)

1. Push the code to your GitHub repository (already done: `main` branch).
2. On [vercel.com/new](https://vercel.com/new), import the repository `Nova-havk`.
3. Vercel picks up the settings from `vercel.json` automatically:

| Setting | Value |
|---|---|
| Framework Preset | Other |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

4. Click **Deploy**. Vercel runs the production build, then starts `dist/index.js` in its Node runtime; Express listens on `$PORT` and serves the tRPC API and the SPA from one process.

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

No environment variables are required for the demo to function; the template's built-in variables are optional and only become relevant if you enable Manus OAuth sign-in in production.

## API reference

| Endpoint | Method | Input / Output |
|---|---|---|
| `/api/trpc/health` | GET | — → `{ status: "ok" }` |
| `/api/trpc/heatIsland.analyze` | POST | `{ surfaceTempCelsius, roadAreaRatio, populationDensity, solarInsolation, analysisAreaM2 }` → rating, grade, area, ROI, payback |
| `/api/trpc/heatIsland.analyzeByDistrict` | GET | `{ districtId }` → same result shape |
| `/api/trpc/heatIsland.demoDistricts` | GET | 3 demo districts (PROJECTED/ILLUSTRATIVE) |
| `/api/trpc/getAlmatyDistricts` | GET | alias for `get-almaty-districts` |
