import { Link } from "wouter";
import { ArrowRight, Droplets, Factory, ThermometerSun, Leaf, TrendingDown, MapPin } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site";
import { Button } from "@/components/ui/button";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-3xl font-bold text-primary md:text-4xl">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function ThreatCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Factory;
  title: string;
  text: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="ice-texture relative overflow-hidden">
        <div className="container grid items-center gap-12 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div className="animate-in-subtle">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <MapPin className="h-3.5 w-3.5" />
              Almaty · Kazakhstan · NovaHack 2024
            </p>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
              From waste water sludge to{" "}
              <span className="text-primary">city-cooling tiles</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Kazakhstan's water utilities produce millions of tonnes of glacial
              flour waste every year. Glacial CoolTile transforms that liability
              into geopolymer cooling tiles that fight urban heat islands,
              absorb CO₂ and lock heavy metals inside a stable glass-like
              matrix.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full px-7 text-base shadow-lg shadow-primary/20">
                <Link href="/planner">
                  Launch AI Heat Island Planner
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/60 px-7 text-base">
                <Link href="/map">View Almaty demo map</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <Stat value="4.2–4.8M" label="tonnes of waste per year in KZ" />
              <Stat value="1.1%" label="currently recycled (official data)" />
              <Stat value="98.8%+" label="heavy metal immobilization" />
            </div>
          </div>
          <div className="animate-in-subtle relative hidden md:block" style={{ animationDelay: "120ms" }}>
            <div className="glass-panel ice-gradient rounded-3xl p-8 shadow-xl shadow-primary/10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                The transparent climate formula
              </p>
              <div className="rounded-2xl bg-white/70 p-6 font-mono text-center text-base leading-relaxed text-foreground md:text-lg">
                0.4×(T/50)&nbsp;+&nbsp;0.3×Road_Ratio<br />
                +&nbsp;0.2×(Density/5000)&nbsp;+&nbsp;0.1×(Solar/1500)
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Not a black-box neural network — a transparent, weighted formula
                that anyone on the jury can verify, built on peer-reviewed
                urban heat island research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-border/60 bg-white/50 py-20">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">The problem</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Glacial flour is a hazard hiding in plain sight
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Glacial flour — fine glacial sediment removed by water utilities to
              protect reservoirs — is currently industrial waste. It carries
              three compounding threats while utilities pay to dispose of it.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <ThreatCard
              icon={Factory}
              title="Ecological threat"
              text="Lagoon discharge silts riverbeds and reservoirs, degrading aquatic ecosystems downstream of treatment facilities."
            />
            <ThreatCard
              icon={Droplets}
              title="Infrastructure threat"
              text="Accumulated sludge clogs channels and increases maintenance costs for water utilities already under financial pressure."
            />
            <ThreatCard
              icon={ThermometerSun}
              title="Toxicological threat"
              text="Concentrated heavy metals in untreated sludge pose contamination risks to soil and groundwater near disposal sites."
            />
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">The solution</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Geopolymer tiles that cool cities and lock toxins away
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              By activating glacial flour into a geopolymer binder, we cast
              reflective, high-albedo paving tiles from a material that is free
              at the source. The geopolymer matrix encapsulates heavy metals
              with demonstrated immobilization above 98.8%, while the light
              surface reflects solar radiation and cuts surface temperatures.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {[
                ["Cools urban heat islands", "High albedo surface reduces radiant heat load on streets and sidewalks"],
                ["Absorbs CO₂", "Geopolymer chemistry sequesters carbon during curing, avoiding clinker emissions"],
                ["Zero transport emissions", "Sourced locally in Almaty — the waste and the product share the same city"],
                ["2.8-year payback", "Projected ROI for pilot districts based on published tile performance data"],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>
                    <strong>{t}</strong>
                    <span className="text-muted-foreground"> — {d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">10-year projection</span>
                <span className="font-display text-3xl font-bold text-primary">156% ROI</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-primary to-chart-3" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Alatau District demo case — see the AI Planner for full
                breakdown.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <TrendingDown className="mb-2 h-5 w-5 text-success" />
                <p className="font-display text-2xl font-bold">−2.8 °C</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  projected peak surface temp. reduction on treated corridors
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Factory className="mb-2 h-5 w-5 text-primary" />
                <p className="font-display text-2xl font-bold">2,500 m²</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  recommended pilot area for Alatau District (projected)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
