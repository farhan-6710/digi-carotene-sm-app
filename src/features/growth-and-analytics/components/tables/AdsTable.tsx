import { Link } from "react-router";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";
import { DailyMetricsBreakdownSelect } from "./DailyMetricsBreakdownSelect";
import { MobileLabel } from "./tableBits";
import type { AdsTableProps, CampaignMetricCellsMetric } from "../../types/components";
import {
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS =
  "grid-cols-[1.4fr_repeat(8,minmax(0,0.72fr))]";

const DOUBLE_GRID_CLASS =
  "grid-cols-[0.6fr_0.6fr_repeat(8,minmax(0,0.72fr))]";

const METRIC_COLUMNS = [
  { label: "SPEND", align: "right" as const },
  { label: "IMPRESSIONS", align: "right" as const },
  { label: "REACH", align: "right" as const },
  { label: "CLICKS", align: "right" as const },
  { label: "CTR", align: "right" as const },
  { label: "CPM", align: "right" as const },
  { label: "FREQ.", align: "right" as const },
  { label: "CONVERSIONS", align: "right" as const },
];

function MetricCells({
  metrics,
  currencyCode,
}: {
  metrics: CampaignMetricCellsMetric;
  currencyCode: string;
}) {
  const ctr = metrics.impressions
    ? Number(((metrics.clicks / metrics.impressions) * 100).toFixed(2))
    : 0;

  return (
    <>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>SPEND</MobileLabel>
        {formatCurrency(metrics.spend, currencyCode)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>IMPRESSIONS</MobileLabel>
        {formatCompact(metrics.impressions)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>REACH</MobileLabel>
        {formatCompact(metrics.reach)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>CLICKS</MobileLabel>
        {formatCompact(metrics.clicks)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>CTR</MobileLabel>
        {formatPercent(ctr)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>CPM</MobileLabel>
        {formatCpm(metrics.cpm, currencyCode)}
      </div>
      <div className="text-right font-mono text-sm text-foreground">
        <MobileLabel>FREQ.</MobileLabel>
        {formatFrequency(metrics.frequency)}
      </div>
      <div className="text-right font-mono text-sm text-primary">
        <MobileLabel>CONVERSIONS</MobileLabel>
        {formatCompact(metrics.conversions)}
      </div>
    </>
  );
}

export function AdsTable({
  rows,
  campaignId,
  adsetId,
  adAccountId,
  currencyCode,
  breakdowns,
  onBreakdownsChange,
  demographicView,
  isDemographicLoading,
}: AdsTableProps) {
  const { buildAdDetailPath } = useGrowthPaths();
  const hasAge = breakdowns.includes("age");
  const hasGender = breakdowns.includes("gender");
  const hasPlacement = breakdowns.includes("placement");
  const isBreakdown = hasAge || hasGender || hasPlacement;
  const isTwoDimensional = hasAge && hasGender;
  const gridClass = isTwoDimensional ? DOUBLE_GRID_CLASS : GRID_CLASS;
  const leadingColumns = isTwoDimensional
    ? [{ label: "AGE" }, { label: "GENDER" }]
    : hasAge
      ? [{ label: "AGE" }]
      : hasGender
        ? [{ label: "GENDER" }]
        : hasPlacement
          ? [{ label: "PLACEMENT" }]
          : [{ label: "AD" }];

  return (
    <DirectoryTable
      title={isBreakdown ? (hasPlacement ? "Placement" : "Age & gender") : "Ads"}
      description={
        isBreakdown
          ? "Meta breakdown for this ad set in the selected period."
          : "Spend and performance by ad in this ad set."
      }
      gridClass={gridClass}
      columns={[...leadingColumns, ...METRIC_COLUMNS]}
      headerAside={
        <DailyMetricsBreakdownSelect
          value={breakdowns}
          onChange={onBreakdownsChange}
          emptyLabel="Ads"
        />
      }
      isLoading={isBreakdown ? isDemographicLoading : false}
      isEmpty={isBreakdown ? demographicView.rows.length === 0 : rows.length === 0}
      emptyMessage={
        isBreakdown
          ? "No breakdown delivery for this ad set in the selected period."
          : "No ads for this ad set yet."
      }
    >
      {isBreakdown
        ? demographicView.rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
                gridClass,
                row.isAgeSummary && "bg-muted/5",
              )}
            >
              {isTwoDimensional ? (
                <>
                  <div className="text-sm font-medium text-foreground">
                    <MobileLabel>AGE</MobileLabel>
                    {row.age ?? ""}
                  </div>
                  <div className={cn("text-sm text-foreground", row.isAgeSummary && "font-medium")}>
                    <MobileLabel>GENDER</MobileLabel>
                    {row.gender ?? ""}
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium text-foreground">
                  <MobileLabel>
                    {hasAge ? "AGE" : hasGender ? "GENDER" : "PLACEMENT"}
                  </MobileLabel>
                  {(hasAge ? row.age : hasGender ? row.gender : row.placement) ?? ""}
                </div>
              )}
              <MetricCells metrics={row.metrics} currencyCode={currencyCode} />
            </div>
          ))
        : rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
                gridClass,
              )}
            >
              <div className="min-w-0 text-sm font-medium text-foreground">
                <MobileLabel>AD</MobileLabel>
                <Link
                  to={buildAdDetailPath(campaignId, adsetId, row.id, adAccountId)}
                  className="line-clamp-2 text-primary hover:underline"
                >
                  {row.name}
                </Link>
              </div>
              <MetricCells metrics={row} currencyCode={currencyCode} />
            </div>
          ))}
    </DirectoryTable>
  );
}
