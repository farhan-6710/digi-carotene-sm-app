import { growthCampaignDetailStatItems } from "../constants/campaignDetailStats";
import { CampaignDailyMetricsTable } from "./tables/CampaignDailyMetricsTable";
import { StatusBadge } from "./tables/tableBits";
import type { GrowthCampaignProfileCardProps } from "../types/components";
import {
  formatCampaignObjective,
  formatCompact,
  formatCurrency,
  formatPercent,
} from "../utils/formatters";
import { cn } from "@/shared/lib/utils";

export function GrowthCampaignProfileCard({ view }: GrowthCampaignProfileCardProps) {
  const details = [
    { label: "Ad account", value: view.adAccountName },
    { label: "Objective", value: formatCampaignObjective(view.objective) },
    { label: "Meta campaign ID", value: view.campaignId },
    { label: "Synced days", value: String(view.dailyRows.length) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Campaign details
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              {view.campaignName}
            </h2>
            <StatusBadge status={view.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            All stored daily metrics for this campaign across the backfill window.
          </p>
        </div>

        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-5">
          {growthCampaignDetailStatItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "px-6 py-4",
                index < growthCampaignDetailStatItems.length - 1 &&
                  "sm:border-r sm:border-border",
                index % 2 === 0 && "border-r border-border sm:border-r",
                index < 4 && "border-b border-border sm:border-b-0",
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
              <span className="text-sm text-foreground">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      <CampaignDailyMetricsTable
        rows={view.dailyRows}
        currencyCode={view.currencyCode}
      />
    </div>
  );
}
