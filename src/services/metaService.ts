import {
  META_ACCOUNT_FIELDS,
  META_API_VERSION,
  META_GRAPH_BASE_URL,
} from "@/features/growth-and-analytics/constants/metaConfig";
import {
  getFollowerInsightRange,
  getMetaSyncRange,
  mapIgMediaType,
  type MetaSyncRange,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";
import type {
  GrowthPlatform,
  MetaAdInfo,
  MetaOrganicInfo,
} from "@/features/growth-and-analytics/types/types";
import { formatMetaApiError } from "@/features/growth-and-analytics/utils/metaApiErrors";

type GraphList<T> = { data?: T[]; paging?: { next?: string } };

async function graphGet(
  version: string,
  path: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const url = new URL(`${META_GRAPH_BASE_URL}/${version}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let json: Record<string, unknown>;
  try {
    const response = await fetch(url.toString());
    json = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Could not reach Meta. Check your connection and try again.");
  }

  const error = json.error as { message?: string } | undefined;
  if (error) {
    throw new Error(formatMetaApiError(error.message ?? "Meta rejected the request."));
  }

  return json;
}

async function graphGetAll<T>(
  version: string,
  path: string,
  params: Record<string, string>,
): Promise<T[]> {
  const first = (await graphGet(version, path, params)) as GraphList<T>;
  const items = [...(first.data ?? [])];
  let next = first.paging?.next;

  while (next) {
    const response = await fetch(next);
    const page = (await response.json()) as GraphList<T>;
    items.push(...(page.data ?? []));
    next = page.paging?.next;
  }

  return items;
}

export async function fetchMetaOrganicInfo(
  platform: GrowthPlatform,
  accountId: string,
  accessToken: string,
): Promise<MetaOrganicInfo> {
  const isInstagram = platform === "instagram";
  const data = await graphGet(
    isInstagram ? META_API_VERSION.instagram : META_API_VERSION.facebook,
    accountId,
    {
      fields: isInstagram
        ? META_ACCOUNT_FIELDS.instagram
        : META_ACCOUNT_FIELDS.facebook,
      access_token: accessToken,
    },
  );

  return {
    accountName: (data.name as string) ?? (data.username as string) ?? "",
    followers:
      (data.followers_count as number) ?? (data.fan_count as number) ?? 0,
    profilePicture: (data.profile_picture_url as string) ?? null,
  };
}

export async function fetchMetaAdInfo(
  adAccountId: string,
  accessToken: string,
): Promise<MetaAdInfo> {
  const normalizedId = adAccountId.startsWith("act_")
    ? adAccountId
    : `act_${adAccountId}`;

  const data = await graphGet(META_API_VERSION.ads, normalizedId, {
    fields: META_ACCOUNT_FIELDS.ad,
    access_token: accessToken,
  });

  return {
    accountName: (data.name as string) ?? "",
    currency: (data.currency as string) ?? "",
  };
}

type IgInsightMetric = {
  name?: string;
  values?: Array<{ value?: number | { value?: number }; end_time?: string }>;
  total_value?: { value?: number };
};

function parseMetaMetricValue(value?: number | { value?: number }): number {
  if (typeof value === "number") return value;
  if (typeof value?.value === "number") return value.value;
  return 0;
}

async function fetchInstagramInsightMetrics(
  accountId: string,
  accessToken: string,
  range: MetaSyncRange,
  metric: string,
  extraParams: Record<string, string> = {},
): Promise<IgInsightMetric[]> {
  const data = (await graphGet(META_API_VERSION.instagram, `${accountId}/insights`, {
    period: "day",
    since: range.sinceUnix,
    until: range.untilUnix,
    metric,
    access_token: accessToken,
    ...extraParams,
  })) as { data?: IgInsightMetric[] };

  return data.data ?? [];
}

export async function fetchInstagramInteractionTotals(
  accountId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<Record<"likes" | "comments" | "shares" | "reposts", number>> {
  const metrics = ["likes", "comments", "shares", "reposts"] as const;
  const data = (await graphGet(META_API_VERSION.instagram, `${accountId}/insights`, {
    period: "day",
    since: range.sinceUnix,
    until: range.untilUnix,
    metric: metrics.join(","),
    metric_type: "total_value",
    access_token: accessToken,
  })) as { data?: IgInsightMetric[] };

  const totals = {
    likes: 0,
    comments: 0,
    shares: 0,
    reposts: 0,
  };

  for (const metric of data.data ?? []) {
    const name = metric.name;
    if (!name || !(name in totals)) continue;
    totals[name as keyof typeof totals] = parseMetaMetricValue(metric.total_value?.value);
  }

  return totals;
}

/** Dashboard: reach always; follower_count only inside Meta's 30-day window. */
export async function fetchInstagramDashboardInsights(
  accountId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<IgInsightMetric[]> {
  const followerRange = getFollowerInsightRange(range);

  const interactionMetrics = ["likes", "comments", "shares", "saves", "reposts"] as const;
  const rangeTotalMetrics = ["views"] as const;
  const requests: Promise<IgInsightMetric[]>[] = [
    fetchInstagramInsightMetrics(accountId, accessToken, range, "reach"),
    ...interactionMetrics.map((metric) =>
      fetchInstagramInsightMetrics(accountId, accessToken, range, metric, {
        metric_type: "total_value",
      }).catch(() => [] as IgInsightMetric[]),
    ),
    ...rangeTotalMetrics.map((metric) =>
      fetchInstagramInsightMetrics(accountId, accessToken, range, metric, {
        metric_type: "total_value",
      }).catch(() => [] as IgInsightMetric[]),
    ),
  ];

  if (followerRange) {
    requests.push(
      fetchInstagramInsightMetrics(
        accountId,
        accessToken,
        followerRange,
        "follower_count",
      ),
    );
  }

  const results = await Promise.all(requests);
  return results.flat();
}

export type IgMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
  shares_count?: number;
  reposts_count?: number;
  insights?: {
    data?: Array<{ name?: string; values?: Array<{ value?: number }> }>;
  };
};

export type IgMediaInsightValues = {
  reach: number;
  views: number;
  saved: number;
  shares: number;
  reposts: number;
};

export function parseIgMediaInsightBlock(
  insights?: IgMediaItem["insights"],
): IgMediaInsightValues {
  const values: Record<string, number> = {};
  for (const metric of insights?.data ?? []) {
    values[metric.name ?? ""] = parseMetaMetricValue(metric.values?.[0]?.value);
  }
  return {
    reach: values.reach ?? 0,
    views: values.views ?? 0,
    saved: values.saved ?? 0,
    shares: values.shares ?? 0,
    reposts: values.reposts ?? 0,
  };
}

export function mergeIgMediaInsightValues(
  insights: IgMediaInsightValues,
  item: Pick<IgMediaItem, "shares_count" | "reposts_count">,
): IgMediaInsightValues {
  return {
    ...insights,
    shares: insights.shares || item.shares_count || 0,
    reposts: insights.reposts || item.reposts_count || 0,
  };
}

export async function fetchInstagramMedia(
  accountId: string,
  accessToken: string,
): Promise<IgMediaItem[]> {
  return graphGetAll<IgMediaItem>(META_API_VERSION.instagram, `${accountId}/media`, {
    fields:
      "id,caption,media_type,media_product_type,timestamp,like_count,comments_count,shares_count,reposts_count,insights.metric(views,reach,saved,shares,reposts)",
    limit: "50",
    access_token: accessToken,
  });
}

export async function fetchInstagramMediaInsights(
  mediaId: string,
  accessToken: string,
): Promise<IgMediaInsightValues> {
  try {
    const data = (await graphGet(
      META_API_VERSION.instagram,
      `${mediaId}/insights`,
      {
        metric: "views,reach,saved,shares,reposts",
        period: "lifetime",
        access_token: accessToken,
      },
    )) as { data?: Array<{ name?: string; values?: Array<{ value?: number }> }> };

    return parseIgMediaInsightBlock({ data: data.data });
  } catch {
    return { reach: 0, views: 0, saved: 0, shares: 0, reposts: 0 };
  }
}

/** Dashboard: impressions, engagement, and fan adds in one Graph request. */
export async function fetchFacebookDashboardInsights(
  pageId: string,
  accessToken: string,
  range: MetaSyncRange,
) {
  const data = (await graphGet(META_API_VERSION.facebook, `${pageId}/insights`, {
    metric: "page_impressions,page_post_engagements,page_fan_adds",
    period: "day",
    since: range.sinceUnix,
    until: range.untilUnix,
    access_token: accessToken,
  })) as { data?: Array<{ name?: string; values?: Array<{ value?: number; end_time?: string }> }> };

  return data.data ?? [];
}

export type FbPostItem = {
  id: string;
  message?: string;
  created_time?: string;
  shares?: { count?: number };
  reactions?: { summary?: { total_count?: number } };
  comments?: { summary?: { total_count?: number } };
};

export async function fetchFacebookPosts(
  pageId: string,
  accessToken: string,
): Promise<FbPostItem[]> {
  return graphGetAll<FbPostItem>(META_API_VERSION.facebook, `${pageId}/posts`, {
    fields:
      "id,message,created_time,shares,comments.summary(total_count),reactions.summary(total_count)",
    limit: "50",
    access_token: accessToken,
  });
}

export async function fetchFacebookPostEngagement(
  postId: string,
  accessToken: string,
): Promise<{ likes: number; comments: number }> {
  try {
    const reactions = (await graphGet(META_API_VERSION.facebook, postId, {
      fields: "reactions.summary(total_count),comments.summary(total_count)",
      access_token: accessToken,
    })) as {
      reactions?: { summary?: { total_count?: number } };
      comments?: { summary?: { total_count?: number } };
    };
    return {
      likes: reactions.reactions?.summary?.total_count ?? 0,
      comments: reactions.comments?.summary?.total_count ?? 0,
    };
  } catch {
    return { likes: 0, comments: 0 };
  }
}

export type AdCampaignStatus = {
  id: string;
  name: string;
  status?: string;
  objective?: string;
};

export async function fetchAdCampaignStatuses(
  adAccountId: string,
  accessToken: string,
): Promise<AdCampaignStatus[]> {
  const id = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  return graphGetAll<AdCampaignStatus>(META_API_VERSION.ads, `${id}/campaigns`, {
    fields: "id,name,status,objective",
    limit: "100",
    access_token: accessToken,
  });
}

export type AdDailyInsight = {
  campaign_id?: string;
  campaign_name?: string;
  date_start?: string;
  spend?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  cpm?: string;
  frequency?: string;
  actions?: Array<{ action_type?: string; value?: string }>;
};

export async function fetchAdDailyInsights(
  adAccountId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<AdDailyInsight[]> {
  const id = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  const timeRange = JSON.stringify({ since: range.from, until: range.to });

  return graphGetAll<AdDailyInsight>(META_API_VERSION.ads, `${id}/insights`, {
    fields:
      "campaign_id,campaign_name,spend,impressions,reach,clicks,cpm,frequency,actions",
    time_range: timeRange,
    time_increment: "1",
    level: "campaign",
    access_token: accessToken,
  });
}

export function getDefaultSyncRange(): MetaSyncRange {
  return getMetaSyncRange();
}

export type IgBackfillMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
  media_url?: string;
  thumbnail_url?: string;
};

export type IgBackfillProfile = {
  username: string;
  followersCount: number;
};

function parseInsightMetricValue(
  metrics: Array<{ name?: string; values?: Array<{ value?: number }> }> | undefined,
  name: string,
): number {
  const metric = metrics?.find((item) => item.name === name);
  const value = metric?.values?.[0]?.value;
  return typeof value === "number" ? value : 0;
}

export async function fetchInstagramBackfillProfile(
  instagramId: string,
  accessToken: string,
): Promise<IgBackfillProfile> {
  const data = await graphGet(
    META_API_VERSION.instagramBackfill,
    instagramId,
    {
      fields: "followers_count,username",
      access_token: accessToken,
    },
  );

  return {
    username: (data.username as string) ?? "",
    followersCount: (data.followers_count as number) ?? 0,
  };
}

export async function fetchInstagramBackfillMedia(
  instagramId: string,
  accessToken: string,
): Promise<IgBackfillMediaItem[]> {
  return graphGetAll<IgBackfillMediaItem>(
    META_API_VERSION.instagramBackfill,
    `${instagramId}/media`,
    {
      fields:
        "id,caption,media_type,media_product_type,timestamp,like_count,comments_count,media_url,thumbnail_url",
      limit: "100",
      access_token: accessToken,
    },
  );
}

export async function fetchInstagramBackfillPostInsights(
  mediaId: string,
  accessToken: string,
): Promise<{ reach: number; impressions: number; saves: number; shares: number; reposts: number }> {
  async function fetchMetric(metric: string): Promise<number> {
    try {
      const data = (await graphGet(
        META_API_VERSION.instagramBackfill,
        `${mediaId}/insights`,
        {
          metric,
          period: "lifetime",
          access_token: accessToken,
        },
      )) as { data?: Array<{ name?: string; values?: Array<{ value?: number }> }> };

      return parseInsightMetricValue(data.data, metric);
    } catch {
      return 0;
    }
  }

  // v24+ deprecated `impressions` on newer media — use `views` and store as impressions.
  // One metric per request avoids a single unsupported metric 400'ing the whole batch.
  const [reach, views, saves, shares, reposts] = await Promise.all([
    fetchMetric("reach"),
    fetchMetric("views"),
    fetchMetric("saved"),
    fetchMetric("shares"),
    fetchMetric("reposts"),
  ]);

  return { reach, impressions: views, saves, shares, reposts };
}

export async function fetchInstagramBackfillFollowerGainByDay(
  instagramId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<Array<{ date: string; gained: number }>> {
  const data = (await graphGet(
    META_API_VERSION.instagramBackfill,
    `${instagramId}/insights`,
    {
      period: "day",
      since: range.sinceUnix,
      until: range.untilUnix,
      metric: "follower_count",
      access_token: accessToken,
    },
  )) as { data?: IgInsightMetric[] };

  const metric = (data.data ?? []).find((item) => item.name === "follower_count");
  const rows: Array<{ date: string; gained: number }> = [];

  for (const point of metric?.values ?? []) {
    if (!point.end_time) continue;
    rows.push({
      date: point.end_time.slice(0, 10),
      gained: Math.round(parseMetaMetricValue(point.value)),
    });
  }

  return rows;
}

export { mapIgMediaType };
