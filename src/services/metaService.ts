import {
  META_ACCOUNT_FIELDS,
  META_API_VERSION,
  META_GRAPH_BASE_URL,
} from "@/features/growth-and-analytics/constants/metaConfig";
import {
  getMetaSyncRange,
  mapIgMediaType,
  type MetaSyncRange,
} from "@/features/growth-and-analytics/utils/metaSyncMappers";
import type {
  GrowthPlatform,
  MetaAdInfo,
  MetaOrganicInfo,
} from "@/features/growth-and-analytics/types/types";

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
    throw new Error(error.message ?? "Meta rejected the request.");
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
  values?: Array<{ value?: number; end_time?: string }>;
};

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

/** follower_count only supports the last 30 days excluding today — fetch separately. */
export async function fetchInstagramFollowerInsights(
  accountId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<IgInsightMetric[]> {
  return fetchInstagramInsightMetrics(accountId, accessToken, range, "follower_count");
}

export async function fetchInstagramReachInsights(
  accountId: string,
  accessToken: string,
  range: MetaSyncRange,
): Promise<IgInsightMetric[]> {
  const reach = await fetchInstagramInsightMetrics(accountId, accessToken, range, "reach");

  let interactionMetrics: IgInsightMetric[] = [];
  try {
    interactionMetrics = await fetchInstagramInsightMetrics(
      accountId,
      accessToken,
      range,
      "total_interactions",
      { metric_type: "total_value" },
    );
  } catch {
    // Some accounts may not expose this metric.
  }

  return [...reach, ...interactionMetrics];
}

export type IgMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

export async function fetchInstagramMedia(
  accountId: string,
  accessToken: string,
): Promise<IgMediaItem[]> {
  return graphGetAll<IgMediaItem>(META_API_VERSION.instagram, `${accountId}/media`, {
    fields:
      "id,caption,media_type,media_product_type,timestamp,like_count,comments_count",
    limit: "50",
    access_token: accessToken,
  });
}

export async function fetchInstagramMediaInsights(
  mediaId: string,
  accessToken: string,
): Promise<{ reach: number; views: number; saved: number }> {
  try {
    const data = (await graphGet(
      META_API_VERSION.instagram,
      `${mediaId}/insights`,
      { metric: "views,reach,saved", period: "lifetime", access_token: accessToken },
    )) as { data?: Array<{ name?: string; values?: Array<{ value?: number }> }> };

    const values: Record<string, number> = {};
    for (const metric of data.data ?? []) {
      values[metric.name ?? ""] = metric.values?.[0]?.value ?? 0;
    }
    return {
      reach: values.reach ?? 0,
      views: values.views ?? 0,
      saved: values.saved ?? 0,
    };
  } catch {
    return { reach: 0, views: 0, saved: 0 };
  }
}

// Facebook page insights — one metric per call, merged by the sync layer.
export async function fetchFacebookInsightMetric(
  pageId: string,
  accessToken: string,
  metric: string,
  range: MetaSyncRange,
) {
  const data = (await graphGet(META_API_VERSION.facebook, `${pageId}/insights`, {
    metric,
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
};

export async function fetchFacebookPosts(
  pageId: string,
  accessToken: string,
): Promise<FbPostItem[]> {
  return graphGetAll<FbPostItem>(META_API_VERSION.facebook, `${pageId}/posts`, {
    fields: "id,message,created_time",
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

export type AdCampaignStatus = { id: string; name: string; status?: string };

export async function fetchAdCampaignStatuses(
  adAccountId: string,
  accessToken: string,
): Promise<AdCampaignStatus[]> {
  const id = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  return graphGetAll<AdCampaignStatus>(META_API_VERSION.ads, `${id}/campaigns`, {
    fields: "id,name,status",
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
  clicks?: string;
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
    fields: "campaign_id,campaign_name,spend,impressions,clicks,actions",
    time_range: timeRange,
    time_increment: "1",
    level: "campaign",
    access_token: accessToken,
  });
}

export function getDefaultSyncRange(): MetaSyncRange {
  return getMetaSyncRange();
}

export { mapIgMediaType };
