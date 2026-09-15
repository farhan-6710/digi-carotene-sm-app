import { StatusBadge } from "../tables/tableBits";
import { AdsetsTable } from "../tables/AdsetsTable";
import { GoogleCampaignDailyMetricsTable } from "./GoogleCampaignDailyMetricsTable";
import {
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
import { cn } from "@/shared/lib/utils";

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

/** Shared Google campaign detail body — KPI set comes from the type matrix. */
export function GoogleCampaignTypeShell({
  typeId,
  view,
  adAccountId,
  periodLabel = "All time",
}: GoogleCampaignTypeShellProps) {
  const typeLabel = GOOGLE_CAMPAIGN_TYPE_LABEL[typeId];
  const childEntity = googleCampaignChildEntityLabel(typeId);
  const kpis = googleCampaignRenderableKpis(typeId);
  const values = buildGoogleCampaignKpiValues(view);

  const details = [
    { label: "Ad account", value: view.adAccountName },
    { label: "Campaign type", value: typeLabel },
    { label: "Campaign ID", value: view.campaignId },
    { label: "Days in period", value: String(view.dailyRows.length) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
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

        <div
          className={cn(
            "grid grid-cols-2 border-b border-border sm:grid-cols-3 lg:grid-cols-5",
          )}
        >
          {kpis.map((kpi, index) => (
            <div
              key={kpi.id}
              className={cn(
                "px-6 py-4",
                index < kpis.length - 1 && "lg:border-r lg:border-border",
                index % 2 === 0 && "border-r border-border sm:border-r",
                index < kpis.length - (kpis.length % 2 === 0 ? 2 : 1) &&
                  "border-b border-border lg:border-b-0",
              )}
            >
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {kpi.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-semibold tracking-tight",
                  (kpi.id === "conversions" ||
                    kpi.id === "ctr" ||
                    kpi.id === "cost_per_conversion") &&
                    "text-primary",
                )}
              >
                {formatKpiValue(kpi.format, values[kpi.id], view.currencyCode)}
              </p>
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-wrap items-center justify-between gap-2 px-6 py-3"
            >
              <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                {detail.label.toUpperCase()}
              </span>
              <span className="text-sm text-foreground">{detail.value}</span>
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
