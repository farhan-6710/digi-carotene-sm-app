import type {
  ContentPostRow,
  DailyMetricRow,
  InstagramDbMediaType,
  InstagramProfile,
  InteractionTotals,
  OrganicAccount,
  PastPostMetric,
  PostRow,
} from "../types/types";

export function mapDbMediaTypeToUi(
  mediaType: InstagramDbMediaType,
): ContentPostRow["mediaType"] {
  if (mediaType === "REEL" || mediaType === "VIDEO") return "Reel";
  if (mediaType === "CAROUSEL") return "Carousel";
  return "Image";
}

export function calcPostEngagementRate(post: {
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  reach: number;
}): number {
  if (post.reach <= 0) return 0;
  const interactions =
    post.likes + post.comments + post.saves + post.shares + post.reposts;
  return Number(((interactions / post.reach) * 100).toFixed(1));
}

export function mapPastPostToPostRow(post: PastPostMetric): PostRow {
  return {
    id: post.id,
    caption: post.caption,
    mediaType: mapDbMediaTypeToUi(post.mediaType),
    reach: post.reach,
    views: post.impressions,
    likes: post.likes,
    comments: post.comments,
    saves: post.saves,
    shares: post.shares,
    reposts: post.reposts,
    engagementRate: calcPostEngagementRate(post),
    postedAt: post.createdAt,
    postThumbnail: post.postThumbnail,
  };
}

export function profileToOrganicAccount(profile: InstagramProfile): OrganicAccount {
  return {
    id: profile.id,
    platform: "instagram",
    accountName: profile.username,
    accountId: profile.instagramId,
    followers: profile.followersCount,
    isActive: true,
    clientId: null,
  };
}

export function sumPostInteractionTotals(posts: PastPostMetric[]): InteractionTotals {
  return posts.reduce<InteractionTotals>(
    (totals, post) => ({
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      saves: totals.saves + post.saves,
      shares: totals.shares + post.shares,
      reposts: totals.reposts + post.reposts,
      views: totals.views + post.impressions,
    }),
    { likes: 0, comments: 0, saves: 0, shares: 0, reposts: 0, views: 0 },
  );
}

export function aggregatePostsToDailyRows(
  posts: PastPostMetric[],
  profile: InstagramProfile,
): DailyMetricRow[] {
  const byDate = new Map<string, DailyMetricRow>();

  for (const post of posts) {
    const date = post.createdAt.slice(0, 10);
    const row =
      byDate.get(date) ??
      ({
        accountId: profile.id,
        accountName: profile.username,
        platform: "instagram",
        date,
        followers: profile.followersCount,
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
      } satisfies DailyMetricRow);

    row.reach += post.reach;
    row.impressions += post.impressions;
    row.likes += post.likes;
    row.comments += post.comments;
    row.saves += post.saves;
    row.shares += post.shares;
    row.reposts += post.reposts;
    row.engagement +=
      post.likes + post.comments + post.saves + post.shares + post.reposts;
    byDate.set(date, row);
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}
