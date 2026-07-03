import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  AdMetricRow,
  GrowthDateRange,
} from "@/features/growth-and-analytics/types/types";

type MetricRow = {
  ad_id: string;
  ad_name: string;
  adset_id: string;
  campaign_id: string;
  metric_date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

function mapMetric(row: MetricRow): AdMetricRow {
  return {
    adId: row.ad_id,
    adName: row.ad_name,
    adsetId: row.adset_id,
    campaignId: row.campaign_id,
    spend: Number(row.spend),
    impressions: row.impressions,
    reach: row.reach,
    clicks: row.clicks,
    cpm: Number(row.cpm),
    frequency: Number(row.frequency),
    conversions: row.conversions,
    date: row.metric_date,
  };
}

function applyDateRange<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  range: GrowthDateRange,
): T {
  let next = query;
  if (range.from) next = next.gte("metric_date", range.from);
  if (range.to) next = next.lte("metric_date", range.to);
  return next as T;
}

export type AdMetricInsert = {
  campaignId: string;
  adsetId: string;
  adId: string;
  adName: string;
  metricDate: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

function toInsertRow(adAccountId: string, row: AdMetricInsert) {
  return {
    ad_account_id: adAccountId,
    campaign_id: row.campaignId,
    adset_id: row.adsetId,
    ad_id: row.adId,
    ad_name: row.adName,
    metric_date: row.metricDate,
    spend: row.spend,
    impressions: row.impressions,
    reach: row.reach,
    clicks: row.clicks,
    cpm: row.cpm,
    frequency: row.frequency,
    conversions: row.conversions,
  };
}

export async function fetchAdMetricsByAdset(
  adAccountId: string,
  adsetId: string,
  range: GrowthDateRange = {},
): Promise<AdMetricRow[]> {
  const base = supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .select(DB.AD_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .order("metric_date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(base, range);
  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdMetricsByAdId(
  adAccountId: string,
  adId: string,
): Promise<AdMetricRow[]> {
  const { data, error } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .select(DB.AD_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("ad_id", adId)
    .order("metric_date", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdNeighborIds(
  adAccountId: string,
  adsetId: string,
  adId: string,
): Promise<{ previousAdId: string | null; nextAdId: string | null }> {
  const { data, error } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .select("ad_id, spend")
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId);

  if (error) throw new Error(error.message);

  const spendByAd = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ ad_id: string; spend: number }>) {
    const current = spendByAd.get(row.ad_id) ?? 0;
    spendByAd.set(row.ad_id, current + Number(row.spend));
  }

  const orderedIds = [...spendByAd.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const index = orderedIds.indexOf(adId);

  return {
    previousAdId: index > 0 ? orderedIds[index - 1]! : null,
    nextAdId: index >= 0 && index < orderedIds.length - 1 ? orderedIds[index + 1]! : null,
  };
}

export async function replaceAdMetricsForAccount(
  adAccountId: string,
  fromDate: string,
  toDate: string,
  rows: AdMetricInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId)
    .gte("metric_date", fromDate)
    .lte("metric_date", toDate);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdMetric(
  adAccountId: string,
  row: AdMetricInsert,
): Promise<void> {
  const { error } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .upsert(toInsertRow(adAccountId, row), {
      onConflict: "ad_account_id,ad_id,metric_date",
    });

  if (error) throw new Error(error.message);
}

export async function clearAdMetricsForAccount(adAccountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.AD_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
