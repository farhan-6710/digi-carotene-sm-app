import { growthAdDetailStatItems } from "../constants/adDetailStats";
import { AdDailyMetricsTable } from "./tables/AdDailyMetricsTable";
import type { GrowthAdProfileCardProps } from "../types/components";
import {
  formatCompact,
  formatCurrency,
  formatPercent,
} from "../utils/formatters";
import { cn } from "@/shared/lib/utils";

function summaryOrDash(value: string | null): string {
  return value?.trim() ? value : "—";
}

export function GrowthAdProfileCard({
  view,
  periodLabel = "All time",
}: GrowthAdProfileCardProps) {
  const details = [
    { label: "Ad account", value: view.adAccountName },
    { label: "Primary text", value: summaryOrDash(view.primaryText) },
    { label: "Headline", value: summaryOrDash(view.headline) },
    { label: "Meta ad ID", value: view.adId },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Ad details
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{view.adName}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Creative and daily performance for {periodLabel.toLowerCase()}.
          </p>
        </div>

        {view.thumbnailUrl ? (
          <div className="border-b border-border px-6 py-5">
            <img
              src={view.thumbnailUrl}
              alt={view.adName}
              className="max-h-56 rounded-lg border border-border object-cover"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-3 lg:grid-cols-6">
          {growthAdDetailStatItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "px-6 py-4",
                index < growthAdDetailStatItems.length - 1 &&
                  "lg:border-r lg:border-border",
                index % 2 === 0 && "border-r border-border sm:border-r",
                index < 4 && "border-b border-border lg:border-b-0",
              )}
            >
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {item.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-semibold tracking-tight",
                  item.valueClassName,
                )}
              >
                {item.format === "currency"
                  ? formatCurrency(item.getValue(view), view.currencyCode)
                  : item.format === "percent"
                    ? formatPercent(item.getValue(view))
                    : formatCompact(item.getValue(view))}
              </p>
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-wrap items-center justify-between gap-2 px-6 py-3"
            >
              <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                {detail.label.toUpperCase()}
              </span>
              <span className="max-w-xl text-right text-sm text-foreground">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AdDailyMetricsTable rows={view.dailyRows} currencyCode={view.currencyCode} />
    </div>
  );
}
