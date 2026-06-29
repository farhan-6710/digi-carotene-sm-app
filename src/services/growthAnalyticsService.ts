import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CampaignMetricRow,
  DailyMetricRow,
  GrowthDateRange,
  PostRow,
  ReportRow,
} from "@/features/growth-and-analytics/types/types";

const DAILY_SELECT =
  "account_id, metric_date, followers, new_followers, reach, impressions, engagement, growth_organic_accounts ( account_name, platform )";

type DailyRow = {
  account_id: string;
  metric_date: string;
  followers: number;
  new_followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  growth_organic_accounts: {
    account_name: string;
    platform: DailyMetricRow["platform"];
  } | null;
};

function applyDateRange<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  column: string,
  range: GrowthDateRange,
): T {
  let next = query;
  if (range.from) next = next.gte(column, range.from);
  if (range.to) next = next.lte(column, range.to);
  return next as T;
}

export async function fetchDailyMetrics(
  range: GrowthDateRange,
): Promise<DailyMetricRow[]> {
  const base = supabase
    .from(DB.GROWTH_DAILY_METRICS.TABLE)
    .select(DAILY_SELECT)
    .order("metric_date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(
    base,
    "metric_date",
    range,
  );

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as DailyRow[]).map((row) => ({
    accountId: row.account_id,
    accountName: row.growth_organic_accounts?.account_name ?? "Unknown",
    platform: row.growth_organic_accounts?.platform ?? "instagram",
    date: row.metric_date,
    followers: row.followers,
    newFollowers: row.new_followers,
    reach: row.reach,
    impressions: row.impressions,
    engagement: row.engagement,
  }));
}

export async function fetchPosts(
  accountId: string,
  range: GrowthDateRange,
): Promise<PostRow[]> {
  const base = supabase
    .from(DB.GROWTH_POSTS.TABLE)
    .select(DB.GROWTH_POSTS.SELECT)
    .eq("account_id", accountId)
    .order("posted_at", { ascending: false });

  const { data, error } = await applyDateRange<typeof base>(
    base,
    "posted_at",
    range,
  );

  if (error) throw new Error(error.message);

  return (
    (data ?? []) as Array<{
      id: string;
      caption: string;
      media_type: PostRow["mediaType"];
      reach: number;
      likes: number;
      comments: number;
      saves: number;
      engagement_rate: number;
      posted_at: string;
    }>
  ).map((row) => ({
    id: row.id,
    caption: row.caption,
    mediaType: row.media_type,
    reach: row.reach,
    likes: row.likes,
    comments: row.comments,
    saves: row.saves,
    engagementRate: Number(row.engagement_rate),
    postedAt: row.posted_at,
  }));
}

export async function fetchCampaignMetrics(
  adAccountId: string,
  range: GrowthDateRange,
): Promise<CampaignMetricRow[]> {
  const base = supabase
    .from(DB.GROWTH_CAMPAIGN_METRICS.TABLE)
    .select(DB.GROWTH_CAMPAIGN_METRICS.SELECT)
    .eq("ad_account_id", adAccountId)
    .order("metric_date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(
    base,
    "metric_date",
    range,
  );

  if (error) throw new Error(error.message);

  return (
    (data ?? []) as Array<{
      campaign_name: string;
      status: CampaignMetricRow["status"];
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
      metric_date: string;
    }>
  ).map((row) => ({
    campaignName: row.campaign_name,
    status: row.status,
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    conversions: row.conversions,
    date: row.metric_date,
  }));
}

export async function fetchReports(): Promise<ReportRow[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_REPORTS.TABLE)
    .select(DB.GROWTH_REPORTS.SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    (data ?? []) as Array<{
      id: string;
      title: string;
      type: ReportRow["type"];
      platform: ReportRow["platform"];
      period_start: string;
      period_end: string;
      created_at: string;
    }>
  ).map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    platform: row.platform,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    createdAt: row.created_at,
  }));
}
