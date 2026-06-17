import { ArrowDown, ArrowUp } from "lucide-react";
import type {
  ReportStatCardsProps,
  ReportStatTrendProps,
} from "@/features/reports/types/components";

function Trend({ delta, label, trend }: ReportStatTrendProps) {
  const isPositive = trend === "positive";

  return (
    <div className="mt-3 flex items-center gap-2 text-xs">
      <span
        className={`inline-flex items-center gap-1 font-medium ${
          isPositive ? "text-status-done" : "text-status-missed"
        }`}
      >
        {isPositive ? (
          <ArrowUp className="size-3.5 rotate-45" aria-hidden="true" />
        ) : (
          <ArrowDown className="size-3.5 -rotate-45" aria-hidden="true" />
        )}
        {delta}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function ReportStatCards({ stats }: ReportStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="text-xs font-semibold tracking-wider text-muted-foreground">
              {stat.label.toUpperCase()}
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight">
              {stat.value}
            </div>
            <Trend
              delta={stat.delta}
              label={stat.deltaLabel}
              trend={stat.trend}
            />
          </div>
        );
      })}
    </div>
  );
}
