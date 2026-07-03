import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  AdsetMetricRow,
  GrowthDateRange,
} from "@/features/growth-and-analytics/types/types";

type MetricRow = {
  adset_id: string;
  adset_name: string;
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

function mapMetric(row: MetricRow): AdsetMetricRow {
  return {
    adsetId: row.adset_id,
    adsetName: row.adset_name,
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

export type AdsetMetricInsert = {
  campaignId: string;
  adsetId: string;
  adsetName: string;
  metricDate: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
};

function toInsertRow(adAccountId: string, row: AdsetMetricInsert) {
  return {
    ad_account_id: adAccountId,
    campaign_id: row.campaignId,
    adset_id: row.adsetId,
    adset_name: row.adsetName,
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

export async function fetchAdsetMetricsByCampaign(
  adAccountId: string,
  campaignId: string,
  range: GrowthDateRange = {},
): Promise<AdsetMetricRow[]> {
  const base = supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .select(DB.ADSET_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("campaign_id", campaignId)
    .order("metric_date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(base, range);
  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdsetMetricsByAdsetId(
  adAccountId: string,
  adsetId: string,
): Promise<AdsetMetricRow[]> {
  const { data, error } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .select(DB.ADSET_DAILY_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .order("metric_date", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as MetricRow[]).map(mapMetric);
}

export async function fetchAdsetNeighborIds(
  adAccountId: string,
  campaignId: string,
  adsetId: string,
): Promise<{ previousAdsetId: string | null; nextAdsetId: string | null }> {
  const { data, error } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .select("adset_id, spend")
    .eq("ad_account_id", adAccountId)
    .eq("campaign_id", campaignId);

  if (error) throw new Error(error.message);

  const spendByAdset = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ adset_id: string; spend: number }>) {
    const current = spendByAdset.get(row.adset_id) ?? 0;
    spendByAdset.set(row.adset_id, current + Number(row.spend));
  }

  const orderedIds = [...spendByAdset.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const index = orderedIds.indexOf(adsetId);

  return {
    previousAdsetId: index > 0 ? orderedIds[index - 1]! : null,
    nextAdsetId: index >= 0 && index < orderedIds.length - 1 ? orderedIds[index + 1]! : null,
  };
}

export async function replaceAdsetMetricsForAccount(
  adAccountId: string,
  fromDate: string,
  toDate: string,
  rows: AdsetMetricInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId)
    .gte("metric_date", fromDate)
    .lte("metric_date", toDate);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdsetMetric(
  adAccountId: string,
  row: AdsetMetricInsert,
): Promise<void> {
  const { error } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .upsert(toInsertRow(adAccountId, row), {
      onConflict: "ad_account_id,adset_id,metric_date",
    });

  if (error) throw new Error(error.message);
}

export async function clearAdsetMetricsForAccount(adAccountId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.ADSET_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
