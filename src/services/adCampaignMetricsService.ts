import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CampaignMetricRow,
  GrowthDateRange,
} from "@/features/growth-and-analytics/types/types";

type MetricRow = {
  id: string;
  ad_account_id: string;
  campaign_id: string;
  campaign_name: string;
  status: CampaignMetricRow["status"];
  objective: string | null;
  metric_date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  conversion_value?: number | null;
  search_impression_share?: number | null;
  search_budget_lost_impression_share?: number | null;
  search_rank_lost_impression_share?: number | null;
  active_view_viewability?: number | null;
  video_views?: number | null;
  average_cpv?: number | null;
  video_quartile_p25_rate?: number | null;
  video_quartile_p50_rate?: number | null;
  video_quartile_p75_rate?: number | null;
  video_quartile_p100_rate?: number | null;
  local_shop_visits?: number | null;
  local_website_visits?: number | null;
  local_direction_views?: number | null;
  local_calls?: number | null;
  local_orders?: number | null;
  local_menu_views?: number | null;
  local_other_actions?: number | null;
};

function nullableNumber(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function mapMetric(row: MetricRow): CampaignMetricRow {
  return {
    campaignId: row.campaign_id,
    campaignName: row.campaign_name,
    status: row.status,
    objective: row.objective,
    spend: Number(row.spend),
    impressions: row.impressions,
    reach: row.reach,
    clicks: row.clicks,
    cpm: Number(row.cpm),
    frequency: Number(row.frequency),
    conversions: row.conversions,
    conversionValue: Number(row.conversion_value ?? 0),
    searchImpressionShare: nullableNumber(row.search_impression_share),
    searchBudgetLostImpressionShare: nullableNumber(
      row.search_budget_lost_impression_share,
    ),
    searchRankLostImpressionShare: nullableNumber(
      row.search_rank_lost_impression_share,
    ),
    activeViewViewability: nullableNumber(row.active_view_viewability),
    videoViews: Number(row.video_views ?? 0),
    averageCpv: nullableNumber(row.average_cpv),
    videoQuartileP25Rate: nullableNumber(row.video_quartile_p25_rate),
    videoQuartileP50Rate: nullableNumber(row.video_quartile_p50_rate),
    videoQuartileP75Rate: nullableNumber(row.video_quartile_p75_rate),
    videoQuartileP100Rate: nullableNumber(row.video_quartile_p100_rate),
    localShopVisits: Number(row.local_shop_visits ?? 0),
    localWebsiteVisits: Number(row.local_website_visits ?? 0),
    localDirectionViews: Number(row.local_direction_views ?? 0),
    localCalls: Number(row.local_calls ?? 0),
    localOrders: Number(row.local_orders ?? 0),
    localMenuViews: Number(row.local_menu_views ?? 0),
    localOtherActions: Number(row.local_other_actions ?? 0),
    date: row.metric_date,
  };
}

function applyDateRange<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  range: GrowthDateRange,
): T {
  let next = query;
  if (range.from) {
    next = next.gte("metric_date", range.from);
  }
  if (range.to) {
    next = next.lte("metric_date", range.to);
  }
  return next as T;
}

export type AdCampaignMetricInsert = {
  campaignId: string;
  campaignName: string;
  status: CampaignMetricRow["status"];
  objective: string | null;
  metricDate: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  conversionValue?: number;
};

function toInsertRow(adAccountId: string, row: AdCampaignMetricInsert) {
  return {
    ad_account_id: adAccountId,
    campaign_id: row.campaignId,
    campaign_name: row.campaignName,
    status: row.status,
    objective: row.objective,
    metric_date: row.metricDate,
    spend: row.spend,
    impressions: row.impressions,
    reach: row.reach,
    clicks: row.clicks,
    cpm: row.cpm,
    frequency: row.frequency,
    conversions: row.conversions,
    conversion_value: row.conversionValue ?? 0,
  };
}

export async function fetchAdCampaignMetricsForAccount(
  adAccountId: string,
  range: GrowthDateRange = {},
): Promise<CampaignMetricRow[]> {
  const base = supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .select(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .order("metric_date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(base, range);
  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdCampaignMetricsByCampaignId(
  adAccountId: string,
  campaignId: string,
): Promise<CampaignMetricRow[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .select(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("campaign_id", campaignId)
    .order("metric_date", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdCampaignNeighborIds(
  adAccountId: string,
  campaignId: string,
): Promise<{ previousCampaignId: string | null; nextCampaignId: string | null }> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .select("campaign_id, spend")
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);

  const spendByCampaign = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ campaign_id: string; spend: number }>) {
    const current = spendByCampaign.get(row.campaign_id) ?? 0;
    spendByCampaign.set(row.campaign_id, current + Number(row.spend));
  }

  const orderedIds = [...spendByCampaign.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const index = orderedIds.indexOf(campaignId);

  return {
    previousCampaignId: index > 0 ? orderedIds[index - 1]! : null,
    nextCampaignId:
      index >= 0 && index < orderedIds.length - 1 ? orderedIds[index + 1]! : null,
  };
}

export async function replaceAdCampaignMetricsForAccount(
  adAccountId: string,
  fromDate: string,
  toDate: string,
  rows: AdCampaignMetricInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId)
    .gte("metric_date", fromDate)
    .lte("metric_date", toDate);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdCampaignMetric(
  adAccountId: string,
  row: AdCampaignMetricInsert,
): Promise<void> {
  const { error } = await supabase.from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE).upsert(
    toInsertRow(adAccountId, row),
    { onConflict: "ad_account_id,campaign_id,metric_date" },
  );

  if (error) throw new Error(error.message);
}

export async function clearAdCampaignMetricsForAccount(
  adAccountId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ADS_CAMPAIGN_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
