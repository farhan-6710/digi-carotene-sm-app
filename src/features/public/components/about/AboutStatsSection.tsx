import { PublicSection } from "@/features/public/components/PublicSection";
import { agencyStats } from "@/features/public/constants/agency";

export function AboutStatsSection() {
  return (
    <PublicSection className="border-b border-border/40 bg-card/20 py-12">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {agencyStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/30 bg-card p-6 text-center shadow-xs transition-colors hover:border-primary/20"
          >
            <div className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </PublicSection>
  );
}
