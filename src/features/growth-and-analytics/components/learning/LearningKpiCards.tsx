import { cn } from "@/shared/lib/utils";

import type { CampaignKpiKey, KpiCardView } from "../../types/types";
import { formatGapPercent, gapStatusLabel } from "../../utils/gapStatus";
import { formatCpm, formatPercent } from "../../utils/formatters";

type LearningKpiCardsProps = {
  kpis: KpiCardView[];
  currencyCode: string;
  selectedKey: CampaignKpiKey;
  onSelect: (key: CampaignKpiKey) => void;
};

function formatKpiValue(
  key: CampaignKpiKey,
  value: number | null,
  currencyCode: string,
): string {
  if (value === null) return "—";
  if (key === "ctr" || key === "conversion_rate" || key === "search_impression_share") {
    return formatPercent(value * 100);
  }
  if (key === "roas") return `${value.toFixed(2)}x`;
  if (key === "results_per_day" || key === "frequency") {
    return value.toFixed(1);
  }
  return formatCpm(value, currencyCode);
}

function statusClass(status: KpiCardView["status"]): string {
  switch (status) {
    case "on_track":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "below":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "off_track":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function LearningKpiCards({
  kpis,
  currencyCode,
  selectedKey,
  onSelect,
}: LearningKpiCardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {kpis.map((kpi) => (
        <button
          key={kpi.key}
          type="button"
          onClick={() => onSelect(kpi.key)}
          className={cn(
            "min-w-[160px] flex-1 rounded-xl border bg-card p-4 text-left transition-colors",
            selectedKey === kpi.key
              ? "border-primary ring-1 ring-primary/30"
              : "border-border hover:bg-muted/30",
          )}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {kpi.label}
            {kpi.primary ? " · Primary" : ""}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {formatKpiValue(kpi.key, kpi.current, currencyCode)}
          </p>
          {kpi.benchmark !== null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Benchmark {formatKpiValue(kpi.key, kpi.benchmark, currencyCode)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">No benchmark</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {kpi.status !== "not_enough_data" && kpi.gap !== null ? (
              <span className="font-mono text-xs tabular-nums">
                {formatGapPercent(kpi.gap)} vs benchmark
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                statusClass(kpi.status),
              )}
            >
              {gapStatusLabel(kpi.status)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
