import { cn } from "@/shared/lib/utils";

import type { CampaignKpiKey, KpiCardView } from "../../types/types";
import { formatGapPercent, gapStatusLabel } from "../../utils/learning/gapStatus";
import { formatCpm, formatPercent } from "../../utils/shared/formatters";

type LearningKpiCardsProps = {
  kpis: KpiCardView[];
  currencyCode: string;
  selectedKey: CampaignKpiKey;
  onSelect: (key: CampaignKpiKey) => void;
};

const RATIO_KEYS = new Set<CampaignKpiKey>([
  "ctr",
  "conversion_rate",
  "search_impression_share",
]);

function formatKpiValue(
  key: CampaignKpiKey,
  value: number | null,
  currencyCode: string,
): string {
  if (value === null) return "—";
  if (RATIO_KEYS.has(key)) {
    return formatPercent(value * 100);
  }
  if (key === "roas") return `${value.toFixed(2)}x`;
  if (key === "results_per_day" || key === "frequency") {
    return value.toFixed(1);
  }
  return formatCpm(value, currencyCode);
}

function statusTone(status: KpiCardView["status"]): string {
  switch (status) {
    case "on_track":
      return "text-emerald-700 dark:text-emerald-300";
    case "below":
      return "text-amber-700 dark:text-amber-300";
    case "off_track":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function LearningKpiCards({
  kpis,
  currencyCode,
  selectedKey,
  onSelect,
}: LearningKpiCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi) => {
        const selected = selectedKey === kpi.key;
        return (
          <button
            key={kpi.key}
            type="button"
            onClick={() => onSelect(kpi.key)}
            aria-pressed={selected}
            className={cn(
              "rounded-2xl border bg-card p-5 text-left shadow-xs transition",
              selected
                ? "border-primary/50 ring-1 ring-primary/20"
                : "border-border hover:bg-muted/40",
            )}
          >
            <p className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {kpi.label}
              {kpi.primary ? " · Primary" : ""}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {formatKpiValue(kpi.key, kpi.current, currencyCode)}
            </p>
            <p className="mt-2 truncate text-xs text-muted-foreground">
              {kpi.key === "frequency" &&
              kpi.benchmarkMin !== null &&
              kpi.benchmarkMax !== null
                ? kpi.benchmarkMin === kpi.benchmarkMax
                  ? `${kpi.benchmarkIsDefault ? "Default" : "Target"} ${formatKpiValue(kpi.key, kpi.benchmarkMin, currencyCode)}`
                  : `${kpi.benchmarkIsDefault ? "Default" : "Ideal"} ${formatKpiValue(kpi.key, kpi.benchmarkMin, currencyCode)}–${formatKpiValue(kpi.key, kpi.benchmarkMax, currencyCode)}`
                : kpi.benchmark !== null
                  ? `${kpi.benchmarkIsDefault ? "Default" : "Target"} ${formatKpiValue(kpi.key, kpi.benchmark, currencyCode)}`
                  : "No target set"}
            </p>
            <p className={cn("mt-2 text-xs font-medium", statusTone(kpi.status))}>
              {kpi.status === "not_enough_data" || kpi.gap === null
                ? gapStatusLabel(kpi.status)
                : `${formatGapPercent(kpi.gap)} · ${gapStatusLabel(kpi.status)}`}
            </p>
          </button>
        );
      })}
    </div>
  );
}
