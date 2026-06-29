import { DB } from "@/services/db";
import {
  fetchAdCampaignStatuses,
  fetchAdDailyInsights,
  fetchFacebookInsightMetric,
  fetchFacebookPostEngagement,
  fetchFacebookPosts,
  fetchInstagramFollowerInsights,
  fetchInstagramReachInsights,
  fetchInstagramMedia,
  fetchInstagramMediaInsights,
  mapIgMediaType,
} from "@/services/metaService";
import { supabase } from "@/services/supabaseClient";
import type { GrowthPlatform } from "@/features/growth-and-analytics/types/types";
import {
  buildDailyMetricRows,
  flattenInsightMetrics,
  getMetaFollowerCountSyncRange,
  getMetaInsightSyncChunks,
  getMetaSyncDateSpan,
  mapCampaignStatus,
  parseConversions,
  parseSpend,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";

async function clearOrganicMetrics(accountId: string): Promise<void> {
  await supabase.from(DB.GROWTH_DAILY_METRICS.TABLE).delete().eq("account_id", accountId);
  await supabase.from(DB.GROWTH_POSTS.TABLE).delete().eq("account_id", accountId);
}

async function clearAdMetrics(adAccountId: string): Promise<void> {
  await supabase
    .from(DB.GROWTH_CAMPAIGN_METRICS.TABLE)
    .delete()
    .eq("ad_account_id", adAccountId);
}

async function syncInstagram(
  metaAccountId: string,
  accessToken: string,
  dbAccountId: string,
  followers: number,
): Promise<void> {
  const dateSpan = getMetaSyncDateSpan();
  const byDate = new Map<string, Record<string, number>>();

  const followerInsights = await fetchInstagramFollowerInsights(
    metaAccountId,
    accessToken,
    getMetaFollowerCountSyncRange(),
  );
  for (const [date, values] of flattenInsightMetrics(followerInsights)) {
    byDate.set(date, { ...(byDate.get(date) ?? {}), ...values });
  }

  for (const range of getMetaInsightSyncChunks()) {
    const insights = await fetchInstagramReachInsights(
      metaAccountId,
      accessToken,
      range,
    );
    const chunk = flattenInsightMetrics(insights);
    for (const [date, values] of chunk) {
      byDate.set(date, { ...(byDate.get(date) ?? {}), ...values });
    }
  }

  const dailyRows = buildDailyMetricRows(byDate, followers).map((row) => ({
    account_id: dbAccountId,
    ...row,
  }));

  if (dailyRows.length > 0) {
    const { error } = await supabase.from(DB.GROWTH_DAILY_METRICS.TABLE).insert(dailyRows);
    if (error) throw new Error(error.message);
  }

  const media = await fetchInstagramMedia(metaAccountId, accessToken);
  const inRange = media.filter((item) => {
    const date = item.timestamp?.slice(0, 10);
    return date && date >= dateSpan.from && date <= dateSpan.to;
  });

  const postRows = [];
  for (const item of inRange.slice(0, 30)) {
    const insightsForPost = await fetchInstagramMediaInsights(item.id, accessToken);
    const likes = item.like_count ?? 0;
    const comments = item.comments_count ?? 0;
    const reach = insightsForPost.reach || insightsForPost.views;
    const engagement = likes + comments;
    const rate = followers > 0 ? Number(((engagement / followers) * 100).toFixed(2)) : 0;

    postRows.push({
      account_id: dbAccountId,
      caption: (item.caption ?? "Untitled post").slice(0, 500),
      media_type: mapIgMediaType(item.media_type, item.media_product_type),
      reach,
      likes,
      comments,
      saves: insightsForPost.saved,
      engagement_rate: rate,
      posted_at: item.timestamp!.slice(0, 10),
    });
  }

  if (postRows.length > 0) {
    const { error } = await supabase.from(DB.GROWTH_POSTS.TABLE).insert(postRows);
    if (error) throw new Error(error.message);
  }
}

async function syncFacebook(
  pageId: string,
  accessToken: string,
  dbAccountId: string,
  followers: number,
): Promise<void> {
  const dateSpan = getMetaSyncDateSpan();
  const byDate = new Map<string, Record<string, number>>();

  for (const range of getMetaInsightSyncChunks()) {
    const metrics = await Promise.all([
      fetchFacebookInsightMetric(pageId, accessToken, "page_impressions", range),
      fetchFacebookInsightMetric(pageId, accessToken, "page_post_engagements", range),
      fetchFacebookInsightMetric(pageId, accessToken, "page_fan_adds", range),
    ]);
    const chunk = flattenInsightMetrics(metrics.flat());
    for (const [date, values] of chunk) {
      byDate.set(date, { ...(byDate.get(date) ?? {}), ...values });
    }
  }

  const dailyRows = buildDailyMetricRows(byDate, followers).map((row) => ({
    account_id: dbAccountId,
    ...row,
  }));

  if (dailyRows.length > 0) {
    const { error } = await supabase.from(DB.GROWTH_DAILY_METRICS.TABLE).insert(dailyRows);
    if (error) throw new Error(error.message);
  }

  const posts = await fetchFacebookPosts(pageId, accessToken);
  const inRange = posts.filter((post) => {
    const date = post.created_time?.slice(0, 10);
    return date && date >= dateSpan.from && date <= dateSpan.to;
  });

  const postRows = [];
  for (const post of inRange.slice(0, 30)) {
    const engagement = await fetchFacebookPostEngagement(post.id, accessToken);
    const likes = engagement.likes;
    const comments = engagement.comments;
    const total = likes + comments;
    const rate = followers > 0 ? Number(((total / followers) * 100).toFixed(2)) : 0;

    postRows.push({
      account_id: dbAccountId,
      caption: (post.message ?? "Untitled post").slice(0, 500),
      media_type: "Image" as const,
      reach: total * 10,
      likes,
      comments,
      saves: 0,
      engagement_rate: rate,
      posted_at: post.created_time!.slice(0, 10),
    });
  }

  if (postRows.length > 0) {
    const { error } = await supabase.from(DB.GROWTH_POSTS.TABLE).insert(postRows);
    if (error) throw new Error(error.message);
  }
}

export async function syncOrganicFromMeta(
  platform: GrowthPlatform,
  metaAccountId: string,
  accessToken: string,
  dbAccountId: string,
  followers: number,
): Promise<void> {
  await clearOrganicMetrics(dbAccountId);

  if (platform === "instagram") {
    await syncInstagram(metaAccountId, accessToken, dbAccountId, followers);
    return;
  }

  await syncFacebook(metaAccountId, accessToken, dbAccountId, followers);
}

export async function syncAdFromMeta(
  metaAdAccountId: string,
  accessToken: string,
  dbAdAccountId: string,
): Promise<void> {
  await clearAdMetrics(dbAdAccountId);

  const dailyInsights = [];
  for (const range of getMetaInsightSyncChunks()) {
    const chunk = await fetchAdDailyInsights(metaAdAccountId, accessToken, range);
    dailyInsights.push(...chunk);
  }

  const campaigns = await fetchAdCampaignStatuses(metaAdAccountId, accessToken);

  const statusById = new Map(
    campaigns.map((campaign) => [campaign.id, mapCampaignStatus(campaign.status)]),
  );
  const statusByName = new Map(
    campaigns.map((campaign) => [campaign.name, mapCampaignStatus(campaign.status)]),
  );

  const rows = dailyInsights
    .filter((row) => row.date_start && row.campaign_name)
    .map((row) => ({
      ad_account_id: dbAdAccountId,
      campaign_name: row.campaign_name!,
      status:
        statusById.get(row.campaign_id ?? "") ??
        statusByName.get(row.campaign_name!) ??
        "Active",
      spend: parseSpend(row.spend),
      impressions: Math.round(Number(row.impressions ?? 0)),
      clicks: Math.round(Number(row.clicks ?? 0)),
      conversions: parseConversions(row.actions),
      metric_date: row.date_start!,
    }));

  if (rows.length === 0) return;

  const { error } = await supabase.from(DB.GROWTH_CAMPAIGN_METRICS.TABLE).insert(rows);
  if (error) throw new Error(error.message);
}
