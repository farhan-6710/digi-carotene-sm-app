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
};

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
  };
}

export async function fetchAdCampaignMetricsForAccount(
  adAccountId: string,
  range: GrowthDateRange = {},
): Promise<CampaignMetricRow[]> {
  const base = supabase
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
    .select(DB.AD_CAMPAIGN_DAILY_METRICS.SELECT)
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
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
    .select(DB.AD_CAMPAIGN_DAILY_METRICS.SELECT)
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
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
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
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId)
    .gte("metric_date", fromDate)
    .lte("metric_date", toDate);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
    .insert(rows.map((row) => toInsertRow(adAccountId, row)));

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdCampaignMetric(
  adAccountId: string,
  row: AdCampaignMetricInsert,
): Promise<void> {
  const { error } = await supabase.from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE).upsert(
    toInsertRow(adAccountId, row),
    { onConflict: "ad_account_id,campaign_id,metric_date" },
  );

  if (error) throw new Error(error.message);
}

export async function clearAdCampaignMetricsForAccount(
  adAccountId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);

  if (error) throw new Error(error.message);
}
