import { ArrowDown, ArrowUp } from "lucide-react";

import type { StatCardTrend } from "@/shared/types/statsCards";

type StatCardTrendProps = {
  delta: string;
  deltaLabel: string;
  trend?: StatCardTrend;
};

export function StatCardTrend({ delta, deltaLabel, trend }: StatCardTrendProps) {
  const isNegative =
    trend === "negative" ||
    (trend === undefined && (delta.startsWith("-") || delta.includes("-")));

  return (
    <div className="mt-3 flex items-center gap-2 text-xs">
      <span
        className={
          isNegative
            ? "inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400"
            : "inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400"
        }
      >
        {isNegative ? (
          <ArrowDown className="size-3.5" aria-hidden="true" />
        ) : (
          <ArrowUp className="size-3.5" aria-hidden="true" />
        )}
        {delta}
      </span>
      <span className="text-muted-foreground">{deltaLabel}</span>
    </div>
  );
}
