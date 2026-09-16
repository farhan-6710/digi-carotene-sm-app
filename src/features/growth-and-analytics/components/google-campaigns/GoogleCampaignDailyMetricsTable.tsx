import { useMemo, useState } from "react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { showToast } from "@/shared/utils/showToast";
import { MultiSelect } from "@/shared/ui/MultiSelect";

import { MobileLabel } from "../tables/tableBits";
import {
  DAILY_METRICS_DEFAULT_COLUMN_IDS,
  DAILY_METRICS_MAX_COLUMNS,
} from "../../constants/googleCampaignDetailLayout";
import {
  GOOGLE_CAMPAIGN_KPI_DEFS,
  type GoogleCampaignKpiId,
  type GoogleCampaignTypeId,
} from "../../constants/googleCampaignTypeMatrix";
import type { GrowthCampaignDetailView } from "../../types/types";
import { dayLabel } from "../../utils/formatters";
import {
  dailyMetricsGridClass,
  formatGoogleDailyMetricCell,
} from "../../utils/googleCampaignDailyMetrics";
import { googleCampaignRenderableKpis } from "../../utils/resolveGoogleCampaignType";

type GoogleCampaignDailyMetricsTableProps = {
  rows: GrowthCampaignDetailView["dailyRows"];
  currencyCode: string;
  typeId: GoogleCampaignTypeId;
};

/** Google daily table — user picks up to 6 metric columns. */
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

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    DAILY_METRICS_DEFAULT_COLUMN_IDS.filter((id) =>
      renderableIds.has(id as GoogleCampaignKpiId),
    ),
  );

  const selectedMetrics = useMemo(
    () =>
      selectedIds
        .filter((id): id is GoogleCampaignKpiId =>
          renderableIds.has(id as GoogleCampaignKpiId),
        )
        .map((id) => GOOGLE_CAMPAIGN_KPI_DEFS[id]),
    [renderableIds, selectedIds],
  );

  const gridClass = dailyMetricsGridClass(Math.max(selectedMetrics.length, 1));

  const columns = [
    { label: "DATE" },
    ...selectedMetrics.map((metric) => ({
      label: metric.label.toUpperCase(),
      align: "right" as const,
    })),
  ];

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
      title="Daily metrics"
      description="Day-by-day results for the selected period. Choose up to 6 columns."
      gridClass={gridClass}
      columns={columns}
      headerAside={
        <div className="w-full min-w-0 sm:w-72">
          <MultiSelect
            id="google-daily-metric-columns"
            label="Columns"
            value={selectedIds}
            onChange={handleColumnsChange}
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
            "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-3",
            gridClass,
          )}
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
