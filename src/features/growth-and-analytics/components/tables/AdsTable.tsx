import { Link } from "react-router";

import { buildGrowthAdDetailPath } from "../../constants/routes";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "./tableBits";
import type { AdsTableProps } from "../../types/components";
import {
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS =
  "grid-cols-[1.4fr_repeat(8,minmax(0,0.72fr))]";

export function AdsTable({
  rows,
  campaignId,
  adsetId,
  adAccountId,
  currencyCode,
}: AdsTableProps) {
  return (
    <DirectoryTable
      title="Ads"
      description="Spend and performance by ad in this ad set."
      gridClass={GRID_CLASS}
      columns={[
        { label: "AD" },
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
      emptyMessage="No ads for this ad set yet."
    >
      {rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
            GRID_CLASS,
          )}
        >
          <div className="min-w-0 text-sm font-medium text-foreground">
            <MobileLabel>AD</MobileLabel>
            <Link
              to={buildGrowthAdDetailPath(campaignId, adsetId, row.id, adAccountId)}
              className="line-clamp-2 text-primary hover:underline"
            >
              {row.name}
            </Link>
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
            {formatPercent(row.ctr)}
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
      ))}
    </DirectoryTable>
  );
}
