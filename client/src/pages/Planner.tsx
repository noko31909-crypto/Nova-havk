import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { SiteNav, SiteFooter, ProjectedDataBadge, GradeChip } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { HeatIslandResult } from "server/logic/heatCalculator";

const FORMULA = "0.4×(T/50) + 0.3×Road_Ratio + 0.2×(Density/5000) + 0.1×(Solar/1500)";

const WEIGHTS: { key: string; label: string; w: string; color: string }[] = [
  { key: "temperature", label: "Surface temperature", w: "0.4", color: "bg-rose-500" },
  { key: "roadRatio", label: "Road area ratio", w: "0.3", color: "bg-orange-500" },
  { key: "density", label: "Population density", w: "0.2", color: "bg-amber-500" },
  { key: "solar", label: "Solar insolation", w: "0.1", color: "bg-teal-600" },
];

interface DistrictPreset {
  id: string;
  name: string;
  surfaceTempCelsius: number;
  roadAreaRatio: number;
  populationDensity: number;
  solarInsolation: number;
  analysisAreaM2: number;
}

const PRESETS: DistrictPreset[] = [
  { id: "alatau", name: "Alatau District", surfaceTempCelsius: 48, roadAreaRatio: 0.82, populationDensity: 8500, solarInsolation: 1400, analysisAreaM2: 2500 },
  { id: "bostandyk", name: "Bostandyk District", surfaceTempCelsius: 41, roadAreaRatio: 0.55, populationDensity: 5500, solarInsolation: 1400, analysisAreaM2: 1900 },
  { id: "almaly", name: "Almaly District", surfaceTempCelsius: 34, roadAreaRatio: 0.38, populationDensity: 3800, solarInsolation: 1400, analysisAreaM2: 1400 },
];

interface FormState {
  surfaceTempCelsius: number;
  roadAreaRatio: number;
  populationDensity: number;
  solarInsolation: number;
  analysisAreaM2: number;
}

const DEFAULTS: FormState = {
  surfaceTempCelsius: 44,
  roadAreaRatio: 0.65,
  populationDensity: 6000,
  solarInsolation: 1400,
  analysisAreaM2: 5000,
};

function ResultPanel({ result }: { result: HeatIslandResult }) {
  const total = result.components.temperature + result.components.roadRatio + result.components.density + result.components.solar;
  return (
    <div className="animate-in-subtle space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GradeChip grade={result.grade} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Climate Rating</p>
            <p className="font-display text-xl font-bold">
              {result.climateRating.toFixed(3)} · {result.gradeLabel}
            </p>
          </div>
        </div>
        <ProjectedDataBadge />
      </div>

      <Separator />

      {/* Component breakdown */}
      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Formula components</p>
        <div className="space-y-2.5">
          {WEIGHTS.map(({ key, label, color }) => {
            const value = result.components[key as keyof typeof result.components];
            return (
              <div key={key} className="flex items-center gap-3 text-sm">
                <span className="w-44 shrink-0">{label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${Math.min((value / total) * 100, 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-muted-foreground">{value.toFixed(3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended tile area</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">
              {result.recommendedTileAreaM2.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">m²</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">10-year ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">
              {result.roiPercent10Year.toFixed(1)}% <span className="text-sm font-normal text-muted-foreground">projected</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payback period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-bold">
              {result.paybackYears.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">years</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>PROJECTED DATA.</strong> All figures above are projections derived
          from peer-reviewed research and scaling heuristics. Field testing in
          Almaty is planned as Phase 2. The formula weights are transparent:{" "}
          <span className="font-mono">{FORMULA}</span>.
        </p>
      </div>
    </div>
  );
}

export default function Planner() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [, navigate] = useLocation();
  const analyze = trpc.heatIsland.analyze.useMutation();

  const isPreset = useMemo(() => {
    return PRESETS.find(
      (p) =>
        Math.abs(p.surfaceTempCelsius - form.surfaceTempCelsius) < 0.5 &&
        Math.abs(p.roadAreaRatio - form.roadAreaRatio) < 0.005 &&
        Math.abs(p.populationDensity - form.populationDensity) < 25 &&
        Math.abs(p.solarInsolation - form.solarInsolation) < 25 &&
        Math.abs(p.analysisAreaM2 - form.analysisAreaM2) < 25,
    );
  }, [form]);

  function runAnalysis() {
    analyze.mutate(
      {
        surfaceTempCelsius: form.surfaceTempCelsius,
        roadAreaRatio: form.roadAreaRatio,
        populationDensity: form.populationDensity,
        solarInsolation: form.solarInsolation,
        analysisAreaM2: form.analysisAreaM2,
      },
      {
        onSuccess: () => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        onError: () => toast.error("Could not run the analysis. Please try again."),
      },
    );
  }

  function applyPreset(p: DistrictPreset) {
    setForm({
      surfaceTempCelsius: p.surfaceTempCelsius,
      roadAreaRatio: p.roadAreaRatio,
      populationDensity: p.populationDensity,
      solarInsolation: p.solarInsolation,
      analysisAreaM2: p.analysisAreaM2,
    });
  }

  const set = (k: keyof FormState) => (v: number) => setForm((f) => ({ ...f, [k]: v }));

  const health = trpc.health.useQuery(undefined, { retry: 1 });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Formula banner */}
        <section className="ice-texture border-b border-border/60 py-12">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI Heat Island Planner</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-bold md:text-4xl">
              Transparent climate analysis for Almaty districts
            </h1>
            <div className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-border bg-white/70 px-6 py-4 font-mono text-sm md:text-base shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Climate_Rating&nbsp;=&nbsp;</span>
              <span>{FORMULA}</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every coefficient is visible and verifiable: surface temperature
              (weight 0.4), sealed road area (0.3), population density (0.2) and
              solar insolation (0.1). Adjust the inputs below or pick a preset
              district.
            </p>
            {health.data?.status !== "ok" && (
              <p className="mt-3 flex items-center gap-2 text-xs text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                Backend health check failed — results may not be available.
              </p>
            )}
          </div>
        </section>

        <section className="container py-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Inputs */}
            <div>
              {/* Presets */}
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-muted-foreground">District presets</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <Button
                      key={p.id}
                      variant={isPreset?.id === p.id ? "default" : "outline"}
                      className={isPreset?.id === p.id ? "rounded-full" : "rounded-full bg-white"}
                      onClick={() => applyPreset(p)}
                    >
                      {p.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="glass-panel space-y-7 rounded-3xl p-7">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-semibold">Surface temperature</Label>
                    <span className="font-mono text-sm font-semibold text-primary">{form.surfaceTempCelsius} °C</span>
                  </div>
                  <Slider
                    value={[form.surfaceTempCelsius]}
                    min={25}
                    max={55}
                    step={1}
                    onValueChange={(v) => set("surfaceTempCelsius")(v[0])}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-semibold">Road area ratio</Label>
                    <span className="font-mono text-sm font-semibold text-primary">{form.roadAreaRatio.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[form.roadAreaRatio]}
                    min={0.1}
                    max={0.95}
                    step={0.01}
                    onValueChange={(v) => set("roadAreaRatio")(v[0])}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-semibold">Population density</Label>
                    <span className="font-mono text-sm font-semibold text-primary">{form.populationDensity.toLocaleString()} /km²</span>
                  </div>
                  <Slider
                    value={[form.populationDensity]}
                    min={1000}
                    max={12000}
                    step={100}
                    onValueChange={(v) => set("populationDensity")(v[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label className="mb-2 block text-sm font-semibold">Solar insolation</Label>
                    <Input
                      type="number"
                      value={form.solarInsolation}
                      onChange={(e) => set("solarInsolation")(Number(e.target.value) || 0)}
                      className="bg-white"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">kWh/m²·year</p>
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-semibold">Analysis area</Label>
                    <Input
                      type="number"
                      value={form.analysisAreaM2}
                      onChange={(e) => set("analysisAreaM2")(Number(e.target.value) || 0)}
                      className="bg-white"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">m²</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    size="lg"
                    className="flex-1 rounded-full shadow-lg shadow-primary/20"
                    onClick={runAnalysis}
                    disabled={analyze.isPending}
                  >
                    {analyze.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Analyze heat island
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white"
                    onClick={() => setForm(DEFAULTS)}
                    title="Reset to defaults"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">Results</p>
                {analyze.data && <ProjectedDataBadge />}
              </div>
              <div
                id="results"
                className="glass-panel min-h-[420px] rounded-3xl p-7"
                style={{ scrollMarginTop: "6rem" }}
              >
                {analyze.isPending && (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Running the transparent formula…</p>
                  </div>
                )}
                {!analyze.isPending && !analyze.data && (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Badge variant="outline" className="rounded-full px-4 py-2 text-xs">
                      Select a preset or enter your own inputs
                    </Badge>
                    <p className="text-sm">
                      Results will appear here with the full component breakdown.
                    </p>
                    <div className="mt-2 rounded-xl bg-secondary/60 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                      {FORMULA}
                    </div>
                  </div>
                )}
                {!analyze.isPending && analyze.data && <ResultPanel result={analyze.data} />}
                {analyze.isError && (
                  <p className="flex min-h-[380px] items-center justify-center text-sm text-destructive">
                    The analysis could not be completed. Please try again.
                  </p>
                )}
              </div>
              <p className="mt-4 flex justify-center">
                <button
                  onClick={() => navigate("/map")}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Compare all 3 demo districts on the map →
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
