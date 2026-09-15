import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "../tables/tableBits";
import type { GrowthCampaignDetailView } from "../../types/types";
import {
  dayLabel,
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS = "grid-cols-[0.85fr_repeat(5,minmax(0,0.72fr))]";

type GoogleCampaignDailyMetricsTableProps = {
  rows: GrowthCampaignDetailView["dailyRows"];
  currencyCode: string;
};

/** Phase 1 Google daily table — only matrix-universal fields we sync today. */
export function GoogleCampaignDailyMetricsTable({
  rows,
  currencyCode,
}: GoogleCampaignDailyMetricsTableProps) {
  return (
    <DirectoryTable
      title="Daily metrics"
      description="Day-by-day cost, traffic, and conversions for this campaign type."
      gridClass={GRID_CLASS}
      columns={[
        { label: "DATE" },
        { label: "COST", align: "right" },
        { label: "IMPRESSIONS", align: "right" },
        { label: "CLICKS", align: "right" },
        { label: "CTR", align: "right" },
        { label: "CONVERSIONS", align: "right" },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="This campaign has no daily results in the selected period."
    >
      {rows.map((row) => {
        const ctr = row.impressions
          ? Number(((row.clicks / row.impressions) * 100).toFixed(2))
          : 0;
        return (
          <div
            key={row.date}
            className={cn(
              "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
              GRID_CLASS,
            )}
          >
            <div className="text-sm font-medium text-foreground">
              <MobileLabel>DATE</MobileLabel>
              {dayLabel(row.date)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>COST</MobileLabel>
              {formatCurrency(row.spend, currencyCode)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>IMPRESSIONS</MobileLabel>
              {formatCompact(row.impressions)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>CLICKS</MobileLabel>
              {formatCompact(row.clicks)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>CTR</MobileLabel>
              {formatPercent(ctr)}
            </div>
            <div className="text-right font-mono text-sm text-primary">
              <MobileLabel>CONVERSIONS</MobileLabel>
              {formatNumber(row.conversions)}
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
