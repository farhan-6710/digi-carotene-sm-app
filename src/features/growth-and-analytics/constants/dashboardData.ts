import { format, subDays } from "date-fns";

import type {
  DailyMetricRow,
  OrganicAccount,
  PostRow,
} from "../types/types";

export const DUMMY_DASHBOARD_ACCOUNTS: OrganicAccount[] = [
  {
    id: "acc-ig-carotene",
    platform: "instagram",
    accountName: "Carotene Studio",
    accountId: "17841400001",
    followers: 24_580,
    isActive: true,
    clientId: null,
  },
  {
    id: "acc-fb-carotene",
    platform: "facebook",
    accountName: "Carotene HQ",
    accountId: "10458200001",
    followers: 18_240,
    isActive: true,
    clientId: null,
  },
];

const DUMMY_HISTORY_DAYS = 365;

function seedValue(seed: number, min: number, max: number): number {
  const wave = Math.sin(seed / 11) * 0.35 + Math.cos(seed / 5) * 0.2;
  const normalized = (wave + 1) / 2;
  return Math.round(min + normalized * (max - min));
}

function buildDailyMetricsForAccount(account: OrganicAccount): DailyMetricRow[] {
  const rows: DailyMetricRow[] = [];
  const baseFollowers = account.followers;
  const platformScale = account.platform === "instagram" ? 1 : 0.72;
  const seedOffset = account.id.length * 17;

  for (let day = 1; day <= DUMMY_HISTORY_DAYS; day += 1) {
    const date = format(subDays(new Date(), day), "yyyy-MM-dd");
    const seed = day + seedOffset;
    const newFollowers = seedValue(seed, 8, 42) * platformScale;
    const reach = seedValue(seed + 3, 1_200, 8_500) * platformScale;
    const impressions = Math.round(reach * seedValue(seed + 5, 14, 22) / 10);
    const likes = seedValue(seed + 7, 80, 620) * platformScale;
    const comments = seedValue(seed + 9, 6, 48);
    const shares = seedValue(seed + 11, 4, 36);
    const reposts = seedValue(seed + 13, 2, 28);
    const saves = seedValue(seed + 15, 10, 95);
    const clicks = seedValue(seed + 17, 12, 140);
    const followers = Math.max(
      0,
      Math.round(baseFollowers - day * (newFollowers / 4)),
    );

    rows.push({
      accountId: account.id,
      accountName: account.accountName,
      platform: account.platform,
      date,
      followers,
      newFollowers: Math.round(newFollowers),
      reach: Math.round(reach),
      impressions,
      engagement: Math.round(likes + comments + shares + reposts),
      likes: Math.round(likes),
      comments,
      shares,
      reposts: Math.round(reposts),
      saves,
      clicks,
    });
  }

  return rows;
}

export const DUMMY_DASHBOARD_METRICS: DailyMetricRow[] =
  DUMMY_DASHBOARD_ACCOUNTS.flatMap(buildDailyMetricsForAccount);

export const DUMMY_DASHBOARD_POSTS: PostRow[] = [
  {
    id: "post-ig-1",
    caption: "Behind the scenes — spring campaign shoot",
    mediaType: "Reel",
    reach: 12_400,
    views: 12_400,
    likes: 842,
    comments: 56,
    saves: 128,
    shares: 34,
    reposts: 18,
    engagementRate: 7.4,
    postThumbnail: null,
    postedAt: "2026-06-18T14:30:00.000Z",
  },
  {
    id: "post-ig-2",
    caption: "Client spotlight: product launch carousel",
    mediaType: "Carousel",
    reach: 9_800,
    views: 9_800,
    likes: 612,
    comments: 41,
    saves: 96,
    shares: 22,
    reposts: 11,
    engagementRate: 6.8,
    postThumbnail: null,
    postedAt: "2026-06-10T11:00:00.000Z",
  },
  {
    id: "post-ig-3",
    caption: "Team offsite recap",
    mediaType: "Image",
    reach: 6_200,
    views: 6_200,
    likes: 388,
    comments: 29,
    saves: 44,
    shares: 12,
    reposts: 6,
    engagementRate: 5.2,
    postThumbnail: null,
    postedAt: "2026-05-28T09:15:00.000Z",
  },
  {
    id: "post-ig-4",
    caption: "Quick tips for better Reels hooks",
    mediaType: "Reel",
    reach: 15_600,
    views: 15_600,
    likes: 1_024,
    comments: 78,
    saves: 210,
    shares: 48,
    reposts: 32,
    engagementRate: 8.1,
    postThumbnail: null,
    postedAt: "2026-05-12T16:45:00.000Z",
  },
  {
    id: "post-ig-5",
    caption: "Poll: what should we cover next?",
    mediaType: "Story",
    reach: 4_100,
    views: 4_100,
    likes: 186,
    comments: 52,
    saves: 12,
    shares: 8,
    reposts: 2,
    engagementRate: 4.6,
    postThumbnail: null,
    postedAt: "2026-04-22T18:20:00.000Z",
  },
  {
    id: "post-ig-6",
    caption: "Monthly analytics digest",
    mediaType: "Carousel",
    reach: 7_900,
    views: 7_900,
    likes: 445,
    comments: 33,
    saves: 72,
    shares: 19,
    reposts: 9,
    engagementRate: 5.9,
    postThumbnail: null,
    postedAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "post-ig-7",
    caption: "New brand identity reveal",
    mediaType: "Reel",
    reach: 18_200,
    views: 18_200,
    likes: 1_312,
    comments: 94,
    saves: 286,
    shares: 62,
    reposts: 41,
    engagementRate: 9.2,
    postThumbnail: null,
    postedAt: "2026-02-08T13:30:00.000Z",
  },
  {
    id: "post-ig-8",
    caption: "Year in review — top moments",
    mediaType: "Image",
    reach: 11_300,
    views: 11_300,
    likes: 728,
    comments: 48,
    saves: 118,
    shares: 28,
    reposts: 14,
    engagementRate: 7.0,
    postThumbnail: null,
    postedAt: "2026-01-20T12:00:00.000Z",
  },
  {
    id: "post-fb-1",
    caption: "Live Q&A: social strategy for Q2",
    mediaType: "Reel",
    reach: 8_600,
    views: 8_600,
    likes: 412,
    comments: 86,
    saves: 54,
    shares: 38,
    reposts: 12,
    engagementRate: 6.1,
    postThumbnail: null,
    postedAt: "2026-06-14T15:00:00.000Z",
  },
  {
    id: "post-fb-2",
    caption: "Case study — retail growth campaign",
    mediaType: "Carousel",
    reach: 6_400,
    views: 6_400,
    likes: 298,
    comments: 44,
    saves: 36,
    shares: 26,
    reposts: 8,
    engagementRate: 5.4,
    postThumbnail: null,
    postedAt: "2026-05-20T11:30:00.000Z",
  },
  {
    id: "post-fb-3",
    caption: "Office culture photo dump",
    mediaType: "Image",
    reach: 4_800,
    views: 4_800,
    likes: 224,
    comments: 31,
    saves: 18,
    shares: 14,
    reposts: 4,
    engagementRate: 4.8,
    postThumbnail: null,
    postedAt: "2026-04-05T09:45:00.000Z",
  },
  {
    id: "post-fb-4",
    caption: "Webinar registration open",
    mediaType: "Image",
    reach: 5_200,
    views: 5_200,
    likes: 186,
    comments: 22,
    saves: 28,
    shares: 42,
    reposts: 6,
    engagementRate: 4.2,
    postThumbnail: null,
    postedAt: "2026-03-02T08:00:00.000Z",
  },
  {
    id: "post-fb-5",
    caption: "Community milestone — thank you!",
    mediaType: "Reel",
    reach: 9_100,
    views: 9_100,
    likes: 512,
    comments: 68,
    saves: 62,
    shares: 44,
    reposts: 16,
    engagementRate: 6.5,
    postThumbnail: null,
    postedAt: "2026-02-18T17:15:00.000Z",
  },
];

const POSTS_BY_ACCOUNT: Record<string, PostRow[]> = {
  "acc-ig-carotene": DUMMY_DASHBOARD_POSTS.filter((post) =>
    post.id.startsWith("post-ig-"),
  ),
  "acc-fb-carotene": DUMMY_DASHBOARD_POSTS.filter((post) =>
    post.id.startsWith("post-fb-"),
  ),
};

export function getDummyMetricsForAccount(accountId: string): DailyMetricRow[] {
  return DUMMY_DASHBOARD_METRICS.filter((row) => row.accountId === accountId);
}

export function getDummyPostsForAccount(accountId: string): PostRow[] {
  return POSTS_BY_ACCOUNT[accountId] ?? [];
}
