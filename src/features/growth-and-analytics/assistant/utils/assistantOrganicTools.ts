/**
 * Organic Pulse tools — Instagram post metrics from DB; Facebook returns
 * page followers (posts are live-only and not cached for tools yet).
 */
import { GROWTH_ORGANIC_ACCOUNT_PARAM } from "../../constants/shared/growthUrlParams";
import {
  fetchOrganicAccountById,
  fetchOrganicAccounts,
} from "@/services/growthAccountsService";
import {
  fetchDailyFollowersForProfile,
  sumFollowersGained,
} from "@/services/instagramDailyFollowersService";
import {
  fetchInstagramProfileById,
  fetchInstagramProfileByOrganicAccountId,
} from "@/services/instagramProfilesService";
import {
  fetchPastPostById,
  fetchPastPostsForProfile,
} from "@/services/pastPostsMetricsService";
import type {
  AssistantToolArgs,
  AssistantToolResult,
} from "@/shared/types/assistant";

const MAX_POSTS = 12;

type ToolContext = { basePath: string };

type Tool = (
  _userId: string,
  args: AssistantToolArgs,
  ctx: ToolContext,
) => Promise<AssistantToolResult>;

function text(args: AssistantToolArgs, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function withOrganicParam(path: string, organicAccountId: string): string {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}${GROWTH_ORGANIC_ACCOUNT_PARAM}=${organicAccountId}`;
}

function sumPosts(
  posts: Awaited<ReturnType<typeof fetchPastPostsForProfile>>,
) {
  return posts.reduce(
    (totals, post) => ({
      reach: totals.reach + post.reach,
      impressions: totals.impressions + post.impressions,
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      saves: totals.saves + post.saves,
      shares: totals.shares + post.shares,
      reposts: totals.reposts + post.reposts,
    }),
    {
      reach: 0,
      impressions: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      reposts: 0,
    },
  );
}

const listOrganicAccounts: Tool = async (_userId, args, ctx) => {
  const query = text(args, "query")?.toLowerCase();
  const accounts = await fetchOrganicAccounts();
  const filtered = accounts.filter((account) => {
    if (!query) return true;
    return `${account.accountName} ${account.platform}`
      .toLowerCase()
      .includes(query);
  });

  return {
    accounts: filtered.slice(0, MAX_POSTS).map((account) => ({
      organicAccountId: account.id,
      platform: account.platform,
      name: account.accountName,
      followers: account.followers,
      lastSyncedAt: account.lastSyncedAt,
      link: withOrganicParam(ctx.basePath, account.id),
      contentLink: withOrganicParam(
        `${ctx.basePath}/content-performance`,
        account.id,
      ),
    })),
  };
};

const getOrganicAccountOverview: Tool = async (_userId, args, ctx) => {
  const organicAccountId = text(args, "organic_account_id");
  if (!organicAccountId) return { error: "organic_account_id is required." };

  const from = text(args, "from");
  const to = text(args, "to");
  const account = await fetchOrganicAccountById(organicAccountId);
  if (!account) return { error: "Organic account not found." };

  const profile = await fetchInstagramProfileByOrganicAccountId(organicAccountId);
  if (!profile) {
    return {
      organicAccountId,
      platform: account.platform,
      name: account.accountName,
      followers: account.followers,
      note:
        account.platform === "facebook"
          ? "Facebook page followers are available; post reach/views/shares are not cached for tools yet. Use the Content Performance UI for live Facebook posts."
          : "No Instagram profile linked yet. Sync the account from Manage Accounts.",
      contentLink: withOrganicParam(
        `${ctx.basePath}/content-performance`,
        organicAccountId,
      ),
    };
  }

  const range = { from, to };
  const [posts, followerRows] = await Promise.all([
    fetchPastPostsForProfile(profile.id, range),
    fetchDailyFollowersForProfile(profile.id, range),
  ]);
  const totals = sumPosts(posts);

  return {
    organicAccountId,
    platform: account.platform,
    name: account.accountName,
    username: profile.username,
    followers: profile.followersCount || account.followers,
    followersGained: sumFollowersGained(followerRows),
    from: from ?? null,
    to: to ?? null,
    postCount: posts.length,
    totals: {
      reach: totals.reach,
      views: totals.impressions,
      likes: totals.likes,
      comments: totals.comments,
      saves: totals.saves,
      shares: totals.shares,
      reposts: totals.reposts,
    },
    recentPosts: posts.slice(0, MAX_POSTS).map((post) => ({
      postId: post.id,
      metaPostId: post.postId,
      caption: post.caption.slice(0, 120),
      reach: post.reach,
      views: post.impressions,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      saves: post.saves,
      createdAt: post.createdAt,
      link: withOrganicParam(
        `${ctx.basePath}/content-performance/posts/${post.id}`,
        organicAccountId,
      ),
    })),
    contentLink: withOrganicParam(
      `${ctx.basePath}/content-performance`,
      organicAccountId,
    ),
  };
};

const getOrganicPostPerformance: Tool = async (_userId, args, ctx) => {
  const postId = text(args, "post_id");
  if (!postId) return { error: "post_id is required." };

  const post = await fetchPastPostById(postId);
  if (!post) return { error: "Post not found in synced metrics." };

  const profile = await fetchInstagramProfileById(post.accountId);
  const organicAccountId = profile?.organicAccountId ?? "";
  const account = organicAccountId
    ? await fetchOrganicAccountById(organicAccountId)
    : null;

  return {
    postId: post.id,
    metaPostId: post.postId,
    organicAccountId: organicAccountId || null,
    accountName: account?.accountName ?? profile?.username ?? null,
    caption: post.caption.slice(0, 240),
    mediaType: post.mediaType,
    createdAt: post.createdAt,
    reach: post.reach,
    views: post.impressions,
    likes: post.likes,
    comments: post.comments,
    saves: post.saves,
    shares: post.shares,
    reposts: post.reposts,
    link: organicAccountId
      ? withOrganicParam(
          `${ctx.basePath}/content-performance/posts/${post.id}`,
          organicAccountId,
        )
      : `${ctx.basePath}/content-performance/posts/${post.id}`,
  };
};

export const ORGANIC_TOOLS: Record<string, Tool> = {
  list_organic_accounts: listOrganicAccounts,
  get_organic_account_overview: getOrganicAccountOverview,
  get_organic_post_performance: getOrganicPostPerformance,
};
