import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Snowflake } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "AI Planner" },
  { href: "/map", label: "Demo Map" },
];

export function SiteNav() {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-panel border-b border-border/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Snowflake className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Glacial CoolTile
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-secondary/50">
      <div className="container py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-display font-semibold text-foreground">
              Glacial CoolTile · NovaHack 2024
            </p>
            <p className="mt-1">
              Turning water-utility glacial flour waste into urban cooling
              infrastructure for Almaty, Bishkek and Tashkent.
            </p>
          </div>
          <p className="max-w-md text-xs leading-relaxed">
            All figures shown are projections based on peer-reviewed research.
            Field validation is planned as Phase 2.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Prominent "PROJECTED DATA" disclaimer — required on every results view.
 */
export function ProjectedDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700",
        className,
      )}
      title="All figures are projections based on peer-reviewed research; field validation is Phase 2."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Projected Data
    </span>
  );
}

/** Grade chip with color semantics for A–F climate grades. */
const GRADE_COLORS: Record<string, string> = {
  A: "bg-rose-500 text-white",
  B: "bg-orange-500 text-white",
  C: "bg-amber-500 text-white",
  D: "bg-lime-600 text-white",
  E: "bg-teal-600 text-white",
  F: "bg-emerald-600 text-white",
};

export function GradeChip({ grade, className }: { grade: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold shadow-sm",
        GRADE_COLORS[grade] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {grade}
    </span>
  );
}
