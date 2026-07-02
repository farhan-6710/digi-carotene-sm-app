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
  metric_date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
};

function mapMetric(row: MetricRow): CampaignMetricRow {
  return {
    campaignName: row.campaign_name,
    status: row.status,
    spend: Number(row.spend),
    impressions: row.impressions,
    clicks: row.clicks,
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
  metricDate: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
};

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
    .insert(
      rows.map((row) => ({
        ad_account_id: adAccountId,
        campaign_id: row.campaignId,
        campaign_name: row.campaignName,
        status: row.status,
        metric_date: row.metricDate,
        spend: row.spend,
        impressions: row.impressions,
        clicks: row.clicks,
        conversions: row.conversions,
      })),
    );

  if (insertError) throw new Error(insertError.message);
}

export async function upsertAdCampaignMetric(
  adAccountId: string,
  row: AdCampaignMetricInsert,
): Promise<void> {
  const { error } = await supabase.from(DB.AD_CAMPAIGN_DAILY_METRICS.TABLE).upsert(
    {
      ad_account_id: adAccountId,
      campaign_id: row.campaignId,
      campaign_name: row.campaignName,
      status: row.status,
      metric_date: row.metricDate,
      spend: row.spend,
      impressions: row.impressions,
      clicks: row.clicks,
      conversions: row.conversions,
    },
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
