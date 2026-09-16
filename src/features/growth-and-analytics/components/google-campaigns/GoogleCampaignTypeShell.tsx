import { StatusBadge } from "../tables/tableBits";
import { AdsetsTable } from "../tables/AdsetsTable";
import { GoogleCampaignDailyMetricsTable } from "./GoogleCampaignDailyMetricsTable";
import { GOOGLE_CAMPAIGN_SUMMARY_KPI_IDS } from "../../constants/googleCampaignDetailLayout";
import {
  GOOGLE_CAMPAIGN_KPI_DEFS,
  GOOGLE_CAMPAIGN_TYPE_LABEL,
  googleCampaignChildEntityLabel,
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

/** Shared Google campaign detail — fixed summary rows + daily column picker. */
export function GoogleCampaignTypeShell({
  typeId,
  view,
  adAccountId,
  periodLabel = "All time",
}: GoogleCampaignTypeShellProps) {
  const typeLabel = GOOGLE_CAMPAIGN_TYPE_LABEL[typeId];
  const childEntity = googleCampaignChildEntityLabel(typeId);
  const values = buildGoogleCampaignKpiValues(view);
  const renderableIds = new Set(
    googleCampaignRenderableKpis(typeId).map((def) => def.id),
  );
  const summaryKpis = GOOGLE_CAMPAIGN_SUMMARY_KPI_IDS.filter((id) =>
    renderableIds.has(id),
  ).map((id) => GOOGLE_CAMPAIGN_KPI_DEFS[id]);

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
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {typeLabel} campaign
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              {view.campaignName}
            </h2>
            <StatusBadge status={view.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            KPIs for this campaign type · {periodLabel.toLowerCase()}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 md:divide-x md:divide-border">
          {summaryKpis.map((kpi) => (
            <div
              key={kpi.id}
              className="flex items-center justify-between gap-4 border-b border-border px-6 py-3"
            >
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <span className="font-mono text-sm font-medium text-foreground">
                {formatKpiValue(kpi.format, values[kpi.id], view.currencyCode)}
              </span>
            </div>
          ))}
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
        typeId={typeId}
      />
    </div>
  );
}
