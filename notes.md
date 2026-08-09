# UI review notes (screenshots, full_page)

Overall: pages render, formula displayed correctly, disclaimer present. Issues to fix:

1. DemoMap table: Bostandyk shows Grade "A" (0.849 → correctly A by >=0.8 bound), but map labels say B/C. Either adjust labels on SVG to match computed grades or adjust demo inputs. Map labels currently "Alatau A / Bostandyk B / Almaly C" but computed: Bostandyk 0.849 = A, Almaly 0.783 = B. Options: change SVG labels to computed grades, or lower demo inputs. Since all data is "PROJECTED", safer: align SVG labels with computed results.
2. DemoMap SVG: road dashed lines render oddly, acceptable but mountain/labels overlap ("Grade B · severe" clipped by dashed line). Minor — adjust label y positions.
3. Planner: works fine. Results area shows empty state + formula — good.
4. Home: looks good; hero stats fine.
5. DemoMap top hero SVG city body fills look washed — acceptable, but labels overlap dashed road lines near Bostandyk.

Fix plan: update DemoMap SVG labels to reflect actual grades (A / A / B) — but two As looks weird; better to lower Bostandyk/Almaly inputs so grades spread A/B/C for demo clarity.
- Bostandyk: temp 42, road 0.60, density 5500 → rating ~0.4*(42/50)+0.3*0.6+0.2*1+0.1*(1400/1500) = 0.336+0.18+0.2+0.093 = 0.809 → still A. Make road 0.55, temp 41 → 0.328+0.165+0.2+0.093=0.786 = B.
- Almaly: temp 39, road 0.45, density 4500 → 0.312+0.135+0.18+0.093 = 0.72 = B. Make road 0.42, temp 38 → 0.304+0.126+0.18+0.093 = 0.703 B... need C <0.8>=? C is 0.5–0.65. Make temp 36, road 0.4, density 4000 → 0.288+0.12+0.16+0.093 = 0.661 B. temp 34, road 0.38, density 3800 → 0.272+0.114+0.152+0.093=0.631 C. Good.
Also update backend ALMATY_DEMO_DISTRICTS same values + update preset in Planner (same values, kept in sync manually).
