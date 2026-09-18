import { useMemo } from "react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { usePersistedColumnIds } from "@/shared/hooks/usePersistedColumnIds";
import { cn } from "@/shared/lib/utils";
import { MultiSelect } from "@/shared/ui/MultiSelect";

import { MobileLabel } from "../tables/tableBits";
import {
  DAILY_METRICS_DEFAULT_COLUMN_IDS,
  GOOGLE_DAILY_METRICS_COLUMNS_STORAGE_KEY,
} from "../../constants/googleCampaignDetailLayout";
import {
  GOOGLE_CAMPAIGN_KPI_DEFS,
  type GoogleCampaignKpiId,
  type GoogleCampaignTypeId,
} from "../../constants/googleCampaignTypeMatrix";
import type { GrowthCampaignDetailView } from "../../types/types";
import { dayLabel } from "../../utils/formatters";
import {
  dailyMetricsGridLayout,
  formatGoogleDailyMetricCell,
} from "../../utils/googleCampaignDailyMetrics";
import { googleCampaignRenderableKpis } from "../../utils/resolveGoogleCampaignType";

type GoogleCampaignDailyMetricsTableProps = {
  rows: GrowthCampaignDetailView["dailyRows"];
  currencyCode: string;
  typeId: GoogleCampaignTypeId;
};

/** Google daily table — pick any columns; right-click headers to reorder. */
export function GoogleCampaignDailyMetricsTable({
  rows,
  currencyCode,
  typeId,
}: GoogleCampaignDailyMetricsTableProps) {
  const metricOptions = useMemo(
    () =>
      googleCampaignRenderableKpis(typeId).map((kpi) => ({
        value: kpi.id,
        label: kpi.label,
      })),
    [typeId],
  );

  const renderableIds = useMemo(
    () => new Set(metricOptions.map((option) => option.value as GoogleCampaignKpiId)),
    [metricOptions],
  );

  const { columnIds, setColumnIds, moveColumn } = usePersistedColumnIds(
    GOOGLE_DAILY_METRICS_COLUMNS_STORAGE_KEY,
    DAILY_METRICS_DEFAULT_COLUMN_IDS,
    renderableIds,
  );

  const selectedMetrics = useMemo(
    () =>
      columnIds
        .filter((id): id is GoogleCampaignKpiId =>
          renderableIds.has(id as GoogleCampaignKpiId),
        )
        .map((id) => GOOGLE_CAMPAIGN_KPI_DEFS[id]),
    [columnIds, renderableIds],
  );

  const layout = dailyMetricsGridLayout(Math.max(selectedMetrics.length, 1));

  const columns = [
    { label: "DATE" },
    ...selectedMetrics.map((metric) => ({
      id: metric.id,
      label: metric.label.toUpperCase(),
      title: metric.label,
      align: "right" as const,
      reorderable: true,
    })),
  ];

  return (
    <DirectoryTable
      title="Daily metrics"
      description="Day-by-day results. Pick columns; click or two-finger tap a header to reorder."
      gridClass={layout.gridClass}
      gridStyle={layout.gridStyle}
      contentMinWidthPx={layout.contentMinWidthPx}
      columns={columns}
      onColumnMove={moveColumn}
      headerAside={
        <div className="w-full min-w-0 sm:w-72">
          <MultiSelect
            id="google-daily-metric-columns"
            label="Columns"
            value={columnIds}
            onChange={setColumnIds}
            options={metricOptions}
            placeholder="Select columns"
            emptyMessage="No metrics available."
          />
        </div>
      }
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="This campaign has no daily results in the selected period."
    >
      {rows.map((row) => (
        <div
          key={row.date}
          className={cn(
            "items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/10",
            layout.gridClass,
          )}
          style={layout.gridStyle}
        >
          <div className="text-sm font-medium text-foreground">
            <MobileLabel>DATE</MobileLabel>
            {dayLabel(row.date)}
          </div>
          {selectedMetrics.length === 0 ? (
            <div className="text-right text-sm text-muted-foreground">—</div>
          ) : (
            selectedMetrics.map((metric) => (
              <div
                key={metric.id}
                className={cn(
                  "text-right font-mono text-sm text-foreground",
                  metric.id === "conversions" && "text-primary",
                )}
              >
                <MobileLabel>{metric.label.toUpperCase()}</MobileLabel>
                {formatGoogleDailyMetricCell(row, metric.id, currencyCode)}
              </div>
            ))
          )}
        </div>
      ))}
    </DirectoryTable>
  );
}
