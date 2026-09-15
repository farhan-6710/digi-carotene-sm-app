import { useMemo, useState } from "react";

import { StatusBadge } from "../tables/tableBits";
import { AdsetsTable } from "../tables/AdsetsTable";
import { GoogleCampaignDailyMetricsTable } from "./GoogleCampaignDailyMetricsTable";
import { GOOGLE_CAMPAIGN_DEFAULT_VISIBLE_KPI_IDS } from "../../constants/googleCampaignDetailLayout";
import {
  GOOGLE_CAMPAIGN_TYPE_LABEL,
  googleCampaignChildEntityLabel,
  type GoogleCampaignKpiId,
  type GoogleCampaignTypeId,
} from "../../constants/googleCampaignTypeMatrix";
import type { GoogleCampaignTypePageProps } from "../../types/components";
import { buildGoogleCampaignKpiValues } from "../../utils/googleCampaignKpiValues";
import { googleCampaignRenderableKpis } from "../../utils/resolveGoogleCampaignType";
import {
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/formatters";
import { MultiSelect } from "@/shared/ui/MultiSelect";

type GoogleCampaignTypeShellProps = GoogleCampaignTypePageProps & {
  typeId: GoogleCampaignTypeId;
};

function formatKpiValue(
  format: "currency" | "percent" | "compact" | "number",
  value: number | null,
  currencyCode: string,
): string {
  if (value === null || Number.isNaN(value)) return "—";
  if (format === "currency") return formatCurrency(value, currencyCode);
  if (format === "percent") return formatPercent(value);
  if (format === "compact") return formatCompact(value);
  return formatNumber(value);
}

function defaultVisibleIds(
  renderableIds: Set<GoogleCampaignKpiId>,
): string[] {
  return GOOGLE_CAMPAIGN_DEFAULT_VISIBLE_KPI_IDS.filter((id) =>
    renderableIds.has(id),
  );
}

/** Shared Google campaign detail — flat metric rows with visible-column control. */
export function GoogleCampaignTypeShell({
  typeId,
  view,
  adAccountId,
  periodLabel = "All time",
}: GoogleCampaignTypeShellProps) {
  const typeLabel = GOOGLE_CAMPAIGN_TYPE_LABEL[typeId];
  const childEntity = googleCampaignChildEntityLabel(typeId);
  const kpis = useMemo(() => googleCampaignRenderableKpis(typeId), [typeId]);
  const values = buildGoogleCampaignKpiValues(view);

  const renderableIds = useMemo(
    () => new Set(kpis.map((kpi) => kpi.id)),
    [kpis],
  );

  const metricOptions = useMemo(
    () =>
      kpis.map((kpi) => ({
        value: kpi.id,
        label: kpi.label,
      })),
    [kpis],
  );

  const [visibleMetricIds, setVisibleMetricIds] = useState(() =>
    defaultVisibleIds(renderableIds),
  );

  const visibleIdSet = useMemo(
    () => new Set(visibleMetricIds),
    [visibleMetricIds],
  );

  const visibleKpis = kpis.filter((kpi) => visibleIdSet.has(kpi.id));

  const details = [
    { label: "Ad account", value: view.adAccountName },
    { label: "Campaign type", value: typeLabel },
    { label: "Campaign ID", value: view.campaignId },
    { label: "Days in period", value: String(view.dailyRows.length) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {typeLabel} campaign
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold tracking-tight">
                  {view.campaignName}
                </h2>
                <StatusBadge status={view.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                KPIs for this campaign type · {periodLabel.toLowerCase()}.
              </p>
            </div>

            <div className="w-full shrink-0 lg:max-w-sm">
              <MultiSelect
                id="google-campaign-visible-metrics"
                label="Visible metrics"
                value={visibleMetricIds}
                onChange={setVisibleMetricIds}
                options={metricOptions}
                placeholder="Select metrics"
                emptyMessage="No metrics available."
              />
            </div>
          </div>
        </div>

        <div>
          {visibleKpis.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              Select one or more metrics to display.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 md:divide-x md:divide-border">
              {visibleKpis.map((kpi) => (
                <div
                  key={kpi.id}
                  className="flex items-center justify-between gap-4 border-b border-border px-6 py-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {kpi.label}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {formatKpiValue(
                      kpi.format,
                      values[kpi.id],
                      view.currencyCode,
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="divide-y divide-border border-t border-border">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-4 px-6 py-3"
            >
              <span className="text-sm text-muted-foreground">{detail.label}</span>
              <span className="text-sm font-medium text-foreground">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AdsetsTable
        rows={view.adsetRows}
        campaignId={view.campaignId}
        adAccountId={adAccountId}
        currencyCode={view.currencyCode}
        platform="google_ads"
        entityLabel={childEntity}
      />

      <GoogleCampaignDailyMetricsTable
        rows={view.dailyRows}
        currencyCode={view.currencyCode}
      />
    </div>
  );
}
