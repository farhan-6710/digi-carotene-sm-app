import type { GoogleCampaignKpiId } from "../constants/googleCampaignTypeMatrix";
import type { GrowthCampaignDetailView } from "../types/types";

export type GoogleCampaignKpiValues = Record<GoogleCampaignKpiId, number | null>;

/** Google share metrics are stored 0–1; UI percent formatter expects 0–100. */
function shareAsPercent(value: number | null): number | null {
  if (value === null || Number.isNaN(value)) return null;
  return Number((value * 100).toFixed(2));
}

/** Build KPI numbers from the campaign detail view (synced + computed). */
export function buildGoogleCampaignKpiValues(
  view: GrowthCampaignDetailView,
): GoogleCampaignKpiValues {
  const spend = view.spend;
  const clicks = view.clicks;
  const impressions = view.impressions;
  const conversions = view.conversions;
  const conversionValue = view.conversionValue;
  const ctr = view.ctr;
  const avgCpc = clicks > 0 ? spend / clicks : null;
  const costPerConversion = conversions > 0 ? spend / conversions : null;
  const conversionRate =
    clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : null;
  const roas = spend > 0 && conversionValue > 0 ? conversionValue / spend : null;

  return {
    impressions,
    clicks,
    ctr,
    spend,
    avg_cpc: avgCpc,
    conversions,
    conversion_value: conversionValue > 0 ? conversionValue : null,
    cost_per_conversion: costPerConversion,
    conversion_rate: conversionRate,
    roas,
    search_impression_share: shareAsPercent(view.searchImpressionShare),
    search_lost_is_budget: shareAsPercent(view.searchBudgetLostImpressionShare),
    search_lost_is_rank: shareAsPercent(view.searchRankLostImpressionShare),
    viewability_rate: shareAsPercent(view.activeViewViewability),
    avg_cpm: view.cpm > 0 ? view.cpm : null,
    video_views: view.videoViews > 0 ? view.videoViews : null,
    avg_cpv: view.averageCpv,
    video_quartile: shareAsPercent(view.videoQuartileP100Rate),
    call_count: null,
    call_duration: null,
    direction_requests: null,
    local_shop_visits: view.localShopVisits,
    local_website_visits: view.localWebsiteVisits,
    local_direction_views: view.localDirectionViews,
    local_calls: view.localCalls,
    local_orders: view.localOrders,
    local_menu_views: view.localMenuViews,
    local_other_actions: view.localOtherActions,
    quality_score: null,
    installs: null,
  };
}
