# Project TODO — Glacial CoolTile (NovaHack 2024 MVP)

## Backend (tRPC API)
- [x] Heat calculator logic with transparent formula: 0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)
- [x] Health check endpoint (health)
- [x] analyze-heat-island POST procedure with grade A–F, recommended area, ROI, payback
- [x] get-almaty-districts GET procedure with 3 pre-analyzed Almaty districts (Almaty data PROJECTED)
- [x] All demo data marked "PROJECTED/ILLUSTRATIVE"
- [x] Vitest tests for calculator + procedures (10 tests passing)

## Frontend
- [x] Design system: elegant light theme, refined typography (Google Fonts), glassy accents, ice-blue/glacier palette
- [x] Landing page: problem (glacial flour waste in KZ), solution (geopolymer tiles), CTA to launch AI Planner
- [x] AI Heat Island Planner page: transparent formula displayed exactly as 0.4×T/50 + 0.3×Road_Ratio + 0.2×Density/5000 + 0.1×Solar/1500
- [x] Manual input fields for each formula variable
- [x] District presets (3 Almaty districts) for quick selection
- [x] Results display: Climate Rating grade A–F, recommended tile area (m²), ROI, payback period
- [x] "PROJECTED DATA" disclaimer visible on all results views
- [x] Demo Map page: comparison of 3 Almaty districts, formula weights explainer, methodology section
- [x] Responsive design + refined micro-interactions/animations
- [x] Navigation between all 3 screens

## DevOps
- [ ] GitHub repo created and code pushed with meaningful commits
  - [ ] Push to user's repo: https://github.com/noko31909-crypto/Nova-havk (empty, use as target)
- [ ] Vercel build configuration (vercel.json / output configuration)
- [ ] Documentation: README.md, SETUP.md, PRESENTATION.md, SUBMISSION.md

## Quality
- [x] pnpm check (TypeScript) passes
- [x] pnpm test passes
- [x] Visual verification via screenshots (desktop)
