import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "./tableBits";
import type { CampaignDailyMetricsTableProps } from "../../types/components";
import {
  dayLabel,
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS =
  "grid-cols-[0.85fr_repeat(8,minmax(0,0.72fr))]";

export function CampaignDailyMetricsTable({
  rows,
  currencyCode,
}: CampaignDailyMetricsTableProps) {
  return (
    <DirectoryTable
      title="Daily metrics"
      description="One row per synced day for this campaign."
      gridClass={GRID_CLASS}
      columns={[
        { label: "DATE" },
        { label: "SPEND", align: "right" },
        { label: "IMPRESSIONS", align: "right" },
        { label: "REACH", align: "right" },
        { label: "CLICKS", align: "right" },
        { label: "CTR", align: "right" },
        { label: "CPM", align: "right" },
        { label: "FREQ.", align: "right" },
        { label: "CONVERSIONS", align: "right" },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No daily metrics stored for this campaign yet."
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
              <MobileLabel>SPEND</MobileLabel>
              {formatCurrency(row.spend, currencyCode)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>IMPRESSIONS</MobileLabel>
              {formatCompact(row.impressions)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>REACH</MobileLabel>
              {formatCompact(row.reach)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>CLICKS</MobileLabel>
              {formatCompact(row.clicks)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>CTR</MobileLabel>
              {formatPercent(ctr)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>CPM</MobileLabel>
              {formatCpm(row.cpm, currencyCode)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>FREQ.</MobileLabel>
              {formatFrequency(row.frequency)}
            </div>
            <div className="text-right font-mono text-sm text-primary">
              <MobileLabel>CONVERSIONS</MobileLabel>
              {formatCompact(row.conversions)}
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
