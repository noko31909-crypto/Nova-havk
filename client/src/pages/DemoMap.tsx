import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { SiteNav, SiteFooter, ProjectedDataBadge, GradeChip } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, FlaskConical, BookOpenText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const WEIGHTS: { label: string; w: string; color: string; basis: string }[] = [
  { label: "Surface temperature (T/50)", w: "0.4", color: "bg-rose-500", basis: "Surface temperature dominates radiant heat load (~40%)" },
  { label: "Road area ratio", w: "0.3", color: "bg-orange-500", basis: "Sealed asphalt drives daytime storage and nocturnal release (~30%)" },
  { label: "Population density (/5000)", w: "0.2", color: "bg-amber-500", basis: "Density proxies anthropogenic heat and canyon geometry (~20%)" },
  { label: "Solar insolation (/1500)", w: "0.1", color: "bg-teal-600", basis: "Solar insolation sets baseline radiative input (~10%)" },
];

interface DistrictRow {
  id: string;
  name: string;
  rating: number;
  grade: string;
  gradeLabel: string;
  areaM2: number;
  roi: number;
  payback: number;
}

export default function DemoMap() {
  const [, navigate] = useLocation();
  const districts = trpc.heatIsland.demoDistricts.useQuery();
  const alatau = trpc.heatIsland.analyzeByDistrict.useQuery({ districtId: "alatau" }, { retry: 1 });
  const bostandyk = trpc.heatIsland.analyzeByDistrict.useQuery({ districtId: "bostandyk" }, { retry: 1 });
  const almaly = trpc.heatIsland.analyzeByDistrict.useQuery({ districtId: "almaly" }, { retry: 1 });

  const tableData: Array<DistrictRow & { loading: boolean }> = [
    { id: "alatau", name: "Alatau District", rating: alatau.data?.climateRating ?? 0, grade: alatau.data?.grade ?? "F", gradeLabel: alatau.data?.gradeLabel ?? "", areaM2: alatau.data?.recommendedTileAreaM2 ?? 0, roi: alatau.data?.roiPercent10Year ?? 0, payback: alatau.data?.paybackYears ?? 0, loading: alatau.isLoading },
    { id: "bostandyk", name: "Bostandyk District", rating: bostandyk.data?.climateRating ?? 0, grade: bostandyk.data?.grade ?? "F", gradeLabel: bostandyk.data?.gradeLabel ?? "", areaM2: bostandyk.data?.recommendedTileAreaM2 ?? 0, roi: bostandyk.data?.roiPercent10Year ?? 0, payback: bostandyk.data?.paybackYears ?? 0, loading: bostandyk.isLoading },
    { id: "almaly", name: "Almaly District", rating: almaly.data?.climateRating ?? 0, grade: almaly.data?.grade ?? "F", gradeLabel: almaly.data?.gradeLabel ?? "", areaM2: almaly.data?.recommendedTileAreaM2 ?? 0, roi: almaly.data?.roiPercent10Year ?? 0, payback: almaly.data?.paybackYears ?? 0, loading: almaly.isLoading },
  ].sort((a, b) => b.rating - a.rating);

  const hasError = alatau.isError || bostandyk.isError || almaly.isError;
  const isLoaded = !alatau.isLoading && !bostandyk.isLoading && !almaly.isLoading;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="container flex flex-1 items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading district analyses…</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="container flex flex-1 items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Some district analyses could not be loaded. Please try refreshing
              the page.
            </p>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        <section className="ice-texture border-b border-border/60 py-12">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Demo Map</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold md:text-4xl">
              Almaty's heat islands, side by side
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Three districts pre-analyzed with the same transparent formula.
              All figures are projected for demonstration; the pilot sequence
              follows the grade ordering.
            </p>
          </div>
        </section>

        <section className="container py-12">
          {/* Stylized map */}
          <div className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
            <svg viewBox="0 0 800 420" className="w-full" role="img" aria-label="Stylized map of Almaty showing the three demo districts">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                </pattern>
              </defs>
              <rect width="800" height="420" fill="url(#grid)" />
              {/* Mountains (Zailiysky Alatau) */}
              <path d="M0 420 L60 340 L120 380 L190 300 L260 360 L340 290 L420 350 L500 310 L580 360 L660 330 L740 370 L800 350 L800 420 Z" fill="oklch(0.88 0.03 215)" />
              {/* City body */}
              <path d="M40 120 Q120 80 230 100 Q350 120 430 105 Q560 90 680 120 Q760 140 770 200 Q780 270 720 300 Q620 340 500 330 Q360 320 240 330 Q120 340 60 300 Q20 260 40 120 Z" fill="oklch(0.93 0.02 220)" stroke="oklch(0.8 0.03 220)" strokeWidth="1.5" />
              {/* Roads */}
              <path d="M180 150 Q380 170 620 180" fill="none" stroke="oklch(0.75 0.04 220)" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />
              <path d="M300 120 Q320 220 280 320" fill="none" stroke="oklch(0.75 0.04 220)" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />
              <path d="M520 130 Q560 230 500 320" fill="none" stroke="oklch(0.75 0.04 220)" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" />

              {/* District markers — positioned roughly west to east */}
              {/* Alatau (west, critical) */}
              <g>
                <circle cx="225" cy="215" r="34" fill="oklch(0.65 0.18 25 / 0.18)" />
                <circle cx="225" cy="215" r="8" fill="oklch(0.55 0.2 25)" />
                <text x="225" y="165" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-foreground">Alatau</text>
                <text x="225" y="182" textAnchor="middle" fontSize="11" className="fill-muted-foreground">Grade A · critical</text>
              </g>
              {/* Bostandyk (center, severe) */}
              <g>
                <circle cx="440" cy="200" r="30" fill="oklch(0.7 0.14 55 / 0.16)" />
                <circle cx="440" cy="200" r="8" fill="oklch(0.65 0.15 55)" />
                <text x="440" y="153" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-foreground">Bostandyk</text>
                <text x="440" y="170" textAnchor="middle" fontSize="11" className="fill-muted-foreground">Grade B · severe</text>
              </g>
              {/* Almaly (east, high) */}
              <g>
                <circle cx="620" cy="230" r="27" fill="oklch(0.75 0.1 85 / 0.16)" />
                <circle cx="620" cy="230" r="8" fill="oklch(0.7 0.12 85)" />
                <text x="620" y="185" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-foreground">Almaly</text>
                <text x="620" y="202" textAnchor="middle" fontSize="11" className="fill-muted-foreground">Grade C · high</text>
              </g>

              <MapPin x="740" y="26" className="text-muted-foreground" />
              <text x="700" y="42" fontSize="11" textAnchor="end" className="fill-muted-foreground">Stylized illustration — not to scale</text>
            </svg>

            <div className="mt-6 flex justify-end">
              <ProjectedDataBadge />
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">District comparison</h2>
              {districts.data ? <ProjectedDataBadge /> : null}
            </div>
            <div className="glass-panel overflow-hidden rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-4">District</th>
                      <th className="px-4 py-4">Grade</th>
                      <th className="px-4 py-4">Climate Rating</th>
                      <th className="px-4 py-4 text-right">Recommended area</th>
                      <th className="px-4 py-4 text-right">10-yr ROI</th>
                      <th className="px-6 py-4 text-right">Payback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr
                        key={row.id}
                        className={cn(
                          "border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40",
                          i === 0 && "bg-accent/30",
                        )}
                      >
                        <td className="px-6 py-4">
                          <button
                            className="flex items-center gap-2 font-semibold text-left hover:text-primary"
                            onClick={() => {
                              navigate(`/planner`);
                            }}
                          >
                            <MapPin className="h-4 w-4 text-primary" />
                            {row.name}
                            {i === 0 && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                                Priority pilot
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          {row.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <GradeChip grade={row.grade} className="h-9 w-9 text-base" />
                          )}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm">
                          {row.loading ? "…" : row.rating.toFixed(3)}
                        </td>
                        <td className="px-4 py-4 text-right font-medium">
                          {row.loading ? "…" : `${row.areaM2.toLocaleString()} m²`}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {row.loading ? "…" : `${row.roi.toFixed(1)}%`}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {row.loading ? "…" : `${row.payback.toFixed(1)} yr`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weights + methodology */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="glass-panel rounded-3xl p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <FlaskConical className="h-5 w-5 text-primary" />
                Climate Rating weights
              </h3>
              <div className="mt-5 space-y-4">
                {WEIGHTS.map((w) => (
                  <div key={w.label} className="flex items-start gap-3">
                    <span className={cn("mt-1 h-3 w-3 shrink-0 rounded-full", w.color)} />
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {w.w} × {w.label}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{w.basis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <BookOpenText className="h-5 w-5 text-primary" />
                Methodology
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  The Climate Rating is a transparent, weighted formula rather
                  than a black-box model. Each input is normalized to a 0–1
                  scale, multiplied by its literature-derived weight, and
                  summed.
                </p>
                <p>
                  <span className="font-mono text-foreground">
                    0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) +
                    0.1×(Solar/1500)
                  </span>
                </p>
                <p>
                  Grades A–F map rating bands to deployment priority: Grade A
                  districts are critical heat islands and receive the largest
                  recommended tile coverage. ROI and payback figures scale with
                  the rating using published geopolymer tile performance data.
                </p>
                <p className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
                  <strong>PROJECTED DATA.</strong> District inputs are
                  illustrative. Field validation of temperature, road coverage
                  and density measurements is planned as Phase 2.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
