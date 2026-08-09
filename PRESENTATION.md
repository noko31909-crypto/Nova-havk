# Presentation Guide — Glacial CoolTile

## The pitch in 60 seconds

Kazakhstan's water utilities produce **4.2–4.8 million tonnes of glacial flour waste per year**, and currently recycle barely **1.1%**. This fine sediment silts riverbeds, clogs channels and concentrates heavy metals. Glacial CoolTile converts that liability into high-albedo geopolymer cooling tiles: a material that is free at the source, locks heavy metals inside a stable glass-like matrix (demonstrated immobilization above 98.8%), absorbs CO2 during curing and reflects solar radiation to cool urban heat islands. The app demonstrates where to deploy first — Almaty — with a fully transparent scoring formula.

## Demo flow for the jury

1. **Landing (`/`)** — problem, solution, key stats. Point at the transparent formula card and stress: no black-box model.
2. **AI Planner (`/planner`)** — pick the **Alatau District** preset, hit *Analyze heat island*. Walk through the live results: rating 0.923 → **Grade A**, 2,210 m² recommended, 187.7% 10-yr ROI, ~1.5-yr payback. Show the slider moving and the breakdown recomputing.
3. **Demo Map (`/map`)** — compare Alatau (A), Bostandyk (B), Almaly (C); explain the weight bar and methodology box.

## The transparent formula

```
Climate_Rating = 0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)
```

| Component | Weight | Why |
|---|---|---|
| Surface temperature T/50 | 0.4 | Dominates radiant heat load |
| Sealed road area ratio | 0.3 | Asphalt stores and releases heat |
| Population density /5000 | 0.2 | Proxy for anthropogenic heat and urban canyon geometry |
| Solar insolation /1500 | 0.1 | Baseline radiative input |

Each input is normalized to 0–1, weighted, and summed. Grades A–F map bands to deployment priority (A ≥ 0.8 critical). ROI and payback scale with the rating using published geopolymer tile performance data.

## Anticipated questions

**"Is the Almaty data real?"** — All district figures are projected and clearly marked PROJECTED/ILLUSTRATIVE in the app; field validation is planned as Phase 2. The geopolymer performance research behind ROI/payback is real, peer-reviewed literature.

**"Why tiles instead of cool roofs?"** — Tiles are walkable, durable, source local (zero transport emissions), and immobilize toxic metals as a side benefit.

**"How is this monetizable?"** — B2G/B2B: water utilities fund waste processing; municipalities fund heat mitigation; one revenue stream instead of one cost.

## Disclaimer

All numbers shown in the app are projections. Field measurements of Almaty temperature, road coverage and density are Phase 2 scope.
