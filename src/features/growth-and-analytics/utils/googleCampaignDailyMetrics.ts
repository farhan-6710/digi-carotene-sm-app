import type { CSSProperties } from "react";

import type { GoogleCampaignKpiId } from "../constants/googleCampaignTypeMatrix";
import { GOOGLE_CAMPAIGN_KPI_DEFS } from "../constants/googleCampaignTypeMatrix";
import type { CampaignMetricRow } from "../types/types";
import {
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "./formatters";

/** Format one Google daily-metric cell from a campaign day row. */
export function formatGoogleDailyMetricCell(
  row: CampaignMetricRow,
  metricId: GoogleCampaignKpiId,
  currencyCode: string,
): string {
  const ctr =
    row.impressions > 0
      ? Number(((row.clicks / row.impressions) * 100).toFixed(2))
      : 0;
  const avgCpc = row.clicks > 0 ? row.spend / row.clicks : null;
  const costPerConversion =
    row.conversions > 0 ? row.spend / row.conversions : null;
  const conversionRate =
    row.clicks > 0
      ? Number(((row.conversions / row.clicks) * 100).toFixed(2))
      : null;
  const roas =
    row.spend > 0 && row.conversionValue > 0
      ? row.conversionValue / row.spend
      : null;

  const values: Partial<Record<GoogleCampaignKpiId, number | null>> = {
    impressions: row.impressions,
    clicks: row.clicks,
    ctr,
    spend: row.spend,
    avg_cpc: avgCpc,
    conversions: row.conversions,
    conversion_value: row.conversionValue > 0 ? row.conversionValue : null,
    cost_per_conversion: costPerConversion,
    conversion_rate: conversionRate,
    roas,
    search_impression_share:
      row.searchImpressionShare !== null
        ? Number((row.searchImpressionShare * 100).toFixed(2))
        : null,
    search_lost_is_budget:
      row.searchBudgetLostImpressionShare !== null
        ? Number((row.searchBudgetLostImpressionShare * 100).toFixed(2))
        : null,
    search_lost_is_rank:
      row.searchRankLostImpressionShare !== null
        ? Number((row.searchRankLostImpressionShare * 100).toFixed(2))
        : null,
    viewability_rate:
      row.activeViewViewability !== null
        ? Number((row.activeViewViewability * 100).toFixed(2))
        : null,
    avg_cpm: row.cpm > 0 ? row.cpm : null,
    video_views: row.videoViews > 0 ? row.videoViews : null,
    avg_cpv: row.averageCpv,
    video_quartile:
      row.videoQuartileP100Rate !== null
        ? Number((row.videoQuartileP100Rate * 100).toFixed(2))
        : null,
    local_shop_visits: row.localShopVisits,
    local_website_visits: row.localWebsiteVisits,
    local_direction_views: row.localDirectionViews,
    local_calls: row.localCalls,
    local_orders: row.localOrders,
    local_menu_views: row.localMenuViews,
    local_other_actions: row.localOtherActions,
  };

  const raw = values[metricId];
  if (raw === null || raw === undefined || Number.isNaN(raw)) return "—";

  const format = GOOGLE_CAMPAIGN_KPI_DEFS[metricId]?.format ?? "number";
  if (format === "currency") return formatCurrency(raw, currencyCode);
  if (format === "percent") return formatPercent(raw);
  if (format === "compact") return formatCompact(raw);
  return formatNumber(raw);
}

const METRIC_COL_MIN_PX = 128;
const LEADING_COL_PX = 136;
const TABLE_PAD_PX = 48;
/** Matches Tailwind `gap-4` on daily metric header/rows. */
const GRID_GAP_PX = 16;

export type DailyMetricsGridLayout = {
  /** Shared on header + each body row (template lives in gridStyle). */
  gridClass: string;
  gridStyle: CSSProperties;
  /** Passed to DirectoryTable `contentMinWidthPx` for horizontal scroll. */
  contentMinWidthPx: number;
};

/**
 * Unlimited metric columns via inline grid-template (avoids Tailwind purge).
 * Fixed px tracks only — header and body are separate grids; `max-content` /
 * content-based fr sizing makes them diverge (wide labels vs short numbers).
 */
export function dailyMetricsGridLayout(
  metricCount: number,
  leadingCols = 1,
): DailyMetricsGridLayout {
  const n = Math.max(metricCount, 1);
  const leading =
    leadingCols === 2
      ? `${LEADING_COL_PX}px ${LEADING_COL_PX}px`
      : `${LEADING_COL_PX}px`;
  const metrics = `repeat(${n}, ${METRIC_COL_MIN_PX}px)`;
  const totalCols = leadingCols + n;

  return {
    gridClass: "grid",
    gridStyle: {
      gridTemplateColumns: `${leading} ${metrics}`,
    },
    contentMinWidthPx:
      leadingCols * LEADING_COL_PX +
      n * METRIC_COL_MIN_PX +
      Math.max(0, totalCols - 1) * GRID_GAP_PX +
      TABLE_PAD_PX,
  };
}

/** @deprecated Prefer dailyMetricsGridLayout for unlimited columns. */
export function dailyMetricsGridClass(
  metricCount: number,
  leadingCols = 1,
): string {
  return dailyMetricsGridLayout(metricCount, leadingCols).gridClass;
}
