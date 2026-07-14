import { Link } from "react-router";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";
import { MobileLabel } from "./tableBits";
import type { AdsetsTableProps } from "../../types/components";
import {
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS =
  "grid-cols-[1.4fr_repeat(8,minmax(0,0.72fr))]";

export function AdsetsTable({
  rows,
  campaignId,
  adAccountId,
  currencyCode,
}: AdsetsTableProps) {
  const { buildAdsetDetailPath } = useGrowthPaths();

  return (
    <DirectoryTable
      title="Ad sets"
      description="Spend and performance by ad set in this campaign."
      gridClass={GRID_CLASS}
      columns={[
        { label: "AD SET" },
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
      emptyMessage="No ad sets for this campaign yet."
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
            <MobileLabel>AD SET</MobileLabel>
            <Link
              to={buildAdsetDetailPath(campaignId, row.id, adAccountId)}
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
