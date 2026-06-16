import type { AccountStatsGridProps } from "@/shared/components/account/types";

export function AccountStatsGrid({ stats }: AccountStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="text-xs font-semibold tracking-wider text-muted-foreground">
            {stat.label.toUpperCase()}
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
