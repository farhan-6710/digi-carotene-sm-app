import { Eye, Heart, MessageCircle, Share2, TrendingUp, Users } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";
import type { FbPostItem } from "@/services/metaService";

import type {
  CategoryDatum,
  ContentPostRow,
  DailyMetricRow,
  GrowthDateRange,
  InteractionTotals,
  LabeledValue,
  OrganicAccount,
  PostRow,
} from "../types/types";
import { formatCompact } from "./formatters";

type InsightSeries = {
  name?: string;
  values?: Array<{ value?: number; end_time?: string }>;
};

export type FacebookOrganicAnalytics = {
  dailyRows: DailyMetricRow[];
  posts: PostRow[];
  contentRows: ContentPostRow[];
  interactionTotals: InteractionTotals;
  pageImpressions: number;
  pageEngagements: number;
  fanAdds: number;
};

function isPostInRange(createdAt: string, range: GrowthDateRange): boolean {
  const day = createdAt.slice(0, 10);
  if (range.from && day < range.from) return false;
  if (range.to && day > range.to) return false;
  return true;
}

function sumInsightValues(series: InsightSeries | undefined): number {
  if (!series?.values) return 0;
  return series.values.reduce((sum, point) => sum + (point.value ?? 0), 0);
}

export function buildFacebookDailyRowsFromInsights(
  account: OrganicAccount,
  insights: InsightSeries[],
): DailyMetricRow[] {
  const byDate = new Map<string, DailyMetricRow>();

  const ensureRow = (date: string) => {
    const existing = byDate.get(date);
    if (existing) return existing;
    const row: DailyMetricRow = {
      accountId: account.id,
      accountName: account.accountName,
      platform: "facebook",
      date,
      followers: account.followers,
      newFollowers: 0,
      reach: 0,
      impressions: 0,
      engagement: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      reposts: 0,
      saves: 0,
      clicks: 0,
    };
    byDate.set(date, row);
    return row;
  };

  for (const series of insights) {
    for (const point of series.values ?? []) {
      const date = (point.end_time ?? "").slice(0, 10);
      if (!date) continue;
      const row = ensureRow(date);
      const value = point.value ?? 0;
      if (
        series.name === "page_media_view" ||
        series.name === "page_impressions"
      ) {
        row.impressions += value;
        row.reach += value;
      } else if (series.name === "page_post_engagements") {
        row.engagement += value;
      } else if (
        series.name === "page_daily_follows_unique" ||
        series.name === "page_daily_follows" ||
        series.name === "page_fan_adds"
      ) {
        row.newFollowers += value;
      }
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function mapFacebookPostToPostRow(post: FbPostItem): PostRow {
  const likes = post.reactions?.summary?.total_count ?? 0;
  const comments = post.comments?.summary?.total_count ?? 0;
  const shares = post.shares?.count ?? 0;
  const interactions = likes + comments + shares;
  const createdAt = post.created_time ?? new Date().toISOString();

  return {
    id: post.id,
    caption: post.message?.trim() || "Untitled post",
    mediaType: "Post",
    reach: 0,
    views: 0,
    likes,
    comments,
    saves: 0,
    shares,
    reposts: 0,
    // No post-level reach from current Graph fields — show interactions as a count score.
    engagementRate: interactions,
    postedAt: createdAt,
    postThumbnail: null,
  };
}

export function mapFacebookPostsToContentRows(posts: PostRow[]): ContentPostRow[] {
  return posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    mediaType: "Post",
    reach: post.reach,
    views: post.views,
    likes: post.likes,
    comments: post.comments,
    saves: post.saves,
    shares: post.shares,
    reposts: post.reposts,
    engagementRate: post.engagementRate,
    postThumbnail: post.postThumbnail,
    linkToDetail: false,
  }));
}

export function buildFacebookOrganicAnalytics(params: {
  account: OrganicAccount;
  range: GrowthDateRange;
  insights: InsightSeries[];
  fbPosts: FbPostItem[];
}): FacebookOrganicAnalytics {
  const { account, range, insights, fbPosts } = params;
  const dailyRows = buildFacebookDailyRowsFromInsights(account, insights);
  const posts = fbPosts
    .map(mapFacebookPostToPostRow)
    .filter((post) => isPostInRange(post.postedAt, range))
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt));

  const interactionTotals = posts.reduce<InteractionTotals>(
    (totals, post) => ({
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      saves: 0,
      shares: totals.shares + post.shares,
      reposts: 0,
      views: 0,
    }),
    { likes: 0, comments: 0, saves: 0, shares: 0, reposts: 0, views: 0 },
  );

  const impressionsSeries = insights.find(
    (item) =>
      item.name === "page_media_view" || item.name === "page_impressions",
  );
  const engagementsSeries = insights.find(
    (item) => item.name === "page_post_engagements",
  );
  const fanAddsSeries = insights.find(
    (item) =>
      item.name === "page_daily_follows_unique" ||
      item.name === "page_daily_follows" ||
      item.name === "page_fan_adds",
  );

  return {
    dailyRows,
    posts,
    contentRows: mapFacebookPostsToContentRows(posts),
    interactionTotals,
    pageImpressions: sumInsightValues(impressionsSeries),
    pageEngagements: sumInsightValues(engagementsSeries),
    fanAdds: sumInsightValues(fanAddsSeries),
  };
}

export function buildFacebookDashboardStatCards(
  account: OrganicAccount,
  analytics: FacebookOrganicAnalytics,
): StatCardItem[] {
  return [
    {
      id: "followers",
      label: "Page Followers",
      value: formatCompact(account.followers),
      description: "As of today",
      icon: Users,
    },
    {
      id: "impressions",
      label: "Page Media Views",
      value: formatCompact(analytics.pageImpressions),
      description: "In selected range",
      icon: Eye,
    },
    {
      id: "engagements",
      label: "Post Engagements",
      value: formatCompact(analytics.pageEngagements),
      description: "In selected range",
      icon: MessageCircle,
    },
    {
      id: "fan-adds",
      label: "New Follows",
      value: formatCompact(analytics.fanAdds),
      description:
        analytics.fanAdds > 0
          ? "In selected range"
          : "No new follows in selected range",
      icon: TrendingUp,
    },
  ];
}

export function buildFacebookContentStatCards(posts: PostRow[]): StatCardItem[] {
  const count = posts.length;
  const likes = posts.reduce((sum, post) => sum + post.likes, 0);
  const comments = posts.reduce((sum, post) => sum + post.comments, 0);
  const shares = posts.reduce((sum, post) => sum + post.shares, 0);
  const description = `Across ${count} posts`;

  return [
    {
      id: "posts",
      label: "Posts",
      value: formatCompact(count),
      description: "In selected range",
      icon: Eye,
    },
    {
      id: "reactions",
      label: "Reactions",
      value: formatCompact(likes),
      description,
      icon: Heart,
    },
    {
      id: "comments",
      label: "Comments",
      value: formatCompact(comments),
      description,
      icon: MessageCircle,
    },
    {
      id: "shares",
      label: "Shares",
      value: formatCompact(shares),
      description,
      icon: Share2,
    },
  ];
}

export function buildFacebookContentTypeSplit(posts: PostRow[]): CategoryDatum[] {
  if (posts.length === 0) return [];
  return [
    {
      key: "post",
      label: "Posts",
      value: posts.length,
      color: "var(--chart-3)",
    },
  ];
}

export function buildFacebookEngagementByType(posts: PostRow[]): LabeledValue[] {
  if (posts.length === 0) return [];
  const avg =
    posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length;
  return [
    {
      label: "Posts",
      value: Number(avg.toFixed(1)),
    },
  ];
}
