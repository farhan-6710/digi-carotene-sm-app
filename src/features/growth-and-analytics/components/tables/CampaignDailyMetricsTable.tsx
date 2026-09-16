import { useMemo, useState } from "react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { showToast } from "@/shared/utils/showToast";
import { MultiSelect } from "@/shared/ui/MultiSelect";

import { DailyMetricsBreakdownSelect } from "./DailyMetricsBreakdownSelect";
import { MobileLabel } from "./tableBits";
import {
  DAILY_METRICS_MAX_COLUMNS,
  META_DAILY_METRIC_COLUMNS,
  META_DAILY_METRICS_DEFAULT_COLUMN_IDS,
  type MetaDailyMetricColumnId,
} from "../../constants/googleCampaignDetailLayout";
import type {
  CampaignDailyMetricsTableProps,
  CampaignMetricCellsMetric,
} from "../../types/components";
import {
  dayLabel,
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "../../utils/formatters";
import { dailyMetricsGridClass } from "../../utils/googleCampaignDailyMetrics";

function formatMetaDailyCell(
  metrics: CampaignMetricCellsMetric,
  columnId: MetaDailyMetricColumnId,
  currencyCode: string,
): string {
  const ctr = metrics.impressions
    ? Number(((metrics.clicks / metrics.impressions) * 100).toFixed(2))
    : 0;

  if (columnId === "spend") return formatCurrency(metrics.spend, currencyCode);
  if (columnId === "impressions") return formatCompact(metrics.impressions);
  if (columnId === "reach") return formatCompact(metrics.reach);
  if (columnId === "clicks") return formatCompact(metrics.clicks);
  if (columnId === "ctr") return formatPercent(ctr);
  if (columnId === "cpm") return formatCpm(metrics.cpm, currencyCode);
  if (columnId === "frequency") return formatFrequency(metrics.frequency);
  return formatCompact(metrics.conversions);
}

function MetricCells({
  metrics,
  currencyCode,
  columnIds,
}: {
  metrics: CampaignMetricCellsMetric;
  currencyCode: string;
  columnIds: MetaDailyMetricColumnId[];
}) {
  return (
    <>
      {columnIds.map((columnId) => {
        const label =
          META_DAILY_METRIC_COLUMNS.find((column) => column.id === columnId)
            ?.label ?? columnId;
        return (
          <div
            key={columnId}
            className={cn(
              "text-right font-mono text-sm text-foreground",
              columnId === "conversions" && "text-primary",
            )}
          >
            <MobileLabel>{label.toUpperCase()}</MobileLabel>
            {formatMetaDailyCell(metrics, columnId, currencyCode)}
          </div>
        );
      })}
    </>
  );
}

export function CampaignDailyMetricsTable({
  rows,
  currencyCode,
  breakdowns,
  onBreakdownsChange,
  demographicView,
  isDemographicLoading,
  showDemographicBreakdown = true,
}: CampaignDailyMetricsTableProps) {
  const metricOptions = META_DAILY_METRIC_COLUMNS.map((column) => ({
    value: column.id,
    label: column.label,
  }));

  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    ...META_DAILY_METRICS_DEFAULT_COLUMN_IDS,
  ]);

  const selectedColumnIds = useMemo(
    () =>
      selectedIds.filter((id): id is MetaDailyMetricColumnId =>
        META_DAILY_METRIC_COLUMNS.some((column) => column.id === id),
      ),
    [selectedIds],
  );

  const effectiveBreakdowns = showDemographicBreakdown ? breakdowns : [];
  const hasAge = effectiveBreakdowns.includes("age");
  const hasGender = effectiveBreakdowns.includes("gender");
  const hasPlacement = effectiveBreakdowns.includes("placement");
  const isBreakdown = hasAge || hasGender || hasPlacement;
  const isTwoDimensional = hasAge && hasGender;

  const metricCount = Math.max(selectedColumnIds.length, 1);
  const gridClass = dailyMetricsGridClass(
    metricCount,
    isTwoDimensional ? 2 : 1,
  );

  const leadingColumns = isTwoDimensional
    ? [{ label: "AGE" }, { label: "GENDER" }]
    : hasAge
      ? [{ label: "AGE" }]
      : hasGender
        ? [{ label: "GENDER" }]
        : hasPlacement
          ? [{ label: "PLACEMENT" }]
          : [{ label: "DATE" }];

  const metricColumns = selectedColumnIds.map((id) => {
    const label =
      META_DAILY_METRIC_COLUMNS.find((column) => column.id === id)?.label ?? id;
    return { label: label.toUpperCase(), align: "right" as const };
  });

  const breakdownTitle = hasPlacement ? "Placement" : "Age & gender";

  const handleColumnsChange = (next: string[]) => {
    if (next.length > DAILY_METRICS_MAX_COLUMNS) {
      showToast(
        "info",
        `You can show up to ${DAILY_METRICS_MAX_COLUMNS} columns.`,
      );
      return;
    }
    setSelectedIds(next);
  };

  return (
    <DirectoryTable
      title={isBreakdown ? breakdownTitle : "Daily metrics"}
      description={
        isBreakdown
          ? `Spend and results split by ${breakdownTitle.toLowerCase()} for the selected period.`
          : "Day-by-day spend and results for the selected period. Choose up to 6 columns."
      }
      gridClass={gridClass}
      columns={[...leadingColumns, ...metricColumns]}
      headerAside={
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-72 sm:items-stretch">
          <MultiSelect
            id="meta-daily-metric-columns"
            label="Columns"
            value={selectedIds}
            onChange={handleColumnsChange}
            options={metricOptions}
            placeholder="Select columns"
            emptyMessage="No metrics available."
          />
          {showDemographicBreakdown ? (
            <DailyMetricsBreakdownSelect
              value={breakdowns}
              onChange={onBreakdownsChange}
            />
          ) : null}
        </div>
      }
      isLoading={isBreakdown ? isDemographicLoading : false}
      isEmpty={isBreakdown ? demographicView.rows.length === 0 : rows.length === 0}
      emptyMessage={
        isBreakdown
          ? `This campaign has no ${breakdownTitle.toLowerCase()} results in the selected period.`
          : "This campaign has no daily results in the selected period."
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
                  <div
                    className={cn(
                      "text-sm text-foreground",
                      row.isAgeSummary && "font-medium",
                    )}
                  >
                    <MobileLabel>GENDER</MobileLabel>
                    {row.gender ?? ""}
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium text-foreground">
                  <MobileLabel>
                    {hasAge ? "AGE" : hasGender ? "GENDER" : "PLACEMENT"}
                  </MobileLabel>
                  {(hasAge ? row.age : hasGender ? row.gender : row.placement) ??
                    ""}
                </div>
              )}
              <MetricCells
                metrics={row.metrics}
                currencyCode={currencyCode}
                columnIds={selectedColumnIds}
              />
            </div>
          ))
        : rows.map((row) => (
            <div
              key={row.date}
              className={cn(
                "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
                gridClass,
              )}
            >
              <div className="text-sm font-medium text-foreground">
                <MobileLabel>DATE</MobileLabel>
                {dayLabel(row.date)}
              </div>
              <MetricCells
                metrics={row}
                currencyCode={currencyCode}
                columnIds={selectedColumnIds}
              />
            </div>
          ))}
    </DirectoryTable>
  );
}
