import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  GrowthDateRange,
  InstagramDbMediaType,
  PastPostMetric,
} from "@/features/growth-and-analytics/types/types";

type PostRow = {
  id: string;
  account_id: string;
  post_id: string;
  caption: string;
  media_type: InstagramDbMediaType;
  created_at: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  post_thumbnail: string | null;
};

function mapPost(row: PostRow): PastPostMetric {
  return {
    id: String(row.id),
    accountId: row.account_id,
    postId: row.post_id,
    caption: row.caption,
    mediaType: row.media_type,
    createdAt: row.created_at,
    reach: row.reach,
    impressions: row.impressions,
    likes: row.likes,
    comments: row.comments,
    saves: row.saves,
    shares: row.shares,
    reposts: row.reposts ?? 0,
    postThumbnail: row.post_thumbnail ?? null,
  };
}

function applyDateRange<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  range: GrowthDateRange,
): T {
  let next = query;
  if (range.from) {
    next = next.gte("created_at", `${range.from}T00:00:00.000Z`);
  }
  if (range.to) {
    next = next.lte("created_at", `${range.to}T23:59:59.999Z`);
  }
  return next as T;
}

export async function fetchPastPostsForProfile(
  profileId: string,
  range: GrowthDateRange = {},
): Promise<PastPostMetric[]> {
  const base = supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .select(DB.GROWTH_ORGANIC_POSTS_METRICS.SELECT)
    .eq("account_id", profileId)
    .order("created_at", { ascending: false });

  const { data, error } = await applyDateRange<typeof base>(base, range);
  if (error) throw new Error(error.message);
  return ((data ?? []) as PostRow[]).map(mapPost);
}

export async function fetchPastPostById(id: string): Promise<PastPostMetric | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .select(DB.GROWTH_ORGANIC_POSTS_METRICS.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPost(data as PostRow) : null;
}

export async function fetchPastPostNeighborIds(
  post: Pick<PastPostMetric, "id" | "accountId">,
): Promise<{ previousPostId: string | null; nextPostId: string | null }> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .select("id")
    .eq("account_id", post.accountId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const ids = ((data ?? []) as Array<{ id: string | number }>).map((row) =>
    String(row.id),
  );
  const index = ids.indexOf(post.id);

  return {
    previousPostId: index > 0 ? ids[index - 1] : null,
    nextPostId:
      index >= 0 && index < ids.length - 1 ? ids[index + 1] : null,
  };
}

export type PastPostInsert = {
  postId: string;
  caption: string;
  mediaType: InstagramDbMediaType;
  createdAt: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reposts: number;
  postThumbnail: string | null;
};

export async function replacePastPostsForProfile(
  profileId: string,
  posts: PastPostInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .delete()
    .eq("account_id", profileId);

  if (deleteError) throw new Error(deleteError.message);
  if (posts.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .insert(
      posts.map((post) => ({
        account_id: profileId,
        post_id: post.postId,
        caption: post.caption,
        media_type: post.mediaType,
        created_at: post.createdAt,
        reach: post.reach,
        impressions: post.impressions,
        likes: post.likes,
        comments: post.comments,
        saves: post.saves,
        shares: post.shares,
        reposts: post.reposts,
        post_thumbnail: post.postThumbnail,
      })),
    );

  if (insertError) throw new Error(insertError.message);
}

export async function upsertPastPost(
  profileId: string,
  post: PastPostInsert,
): Promise<void> {
  const { error } = await supabase.from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE).upsert(
    {
      account_id: profileId,
      post_id: post.postId,
      caption: post.caption,
      media_type: post.mediaType,
      created_at: post.createdAt,
      reach: post.reach,
      impressions: post.impressions,
      likes: post.likes,
      comments: post.comments,
      saves: post.saves,
      shares: post.shares,
      reposts: post.reposts,
      post_thumbnail: post.postThumbnail,
    },
    { onConflict: "account_id,post_id" },
  );

  if (error) throw new Error(error.message);
}

export async function clearPastPostsForOrganicAccount(
  organicAccountId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .select("id")
    .eq("organic_account_id", organicAccountId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return;

  const { error: deleteError } = await supabase
    .from(DB.GROWTH_ORGANIC_POSTS_METRICS.TABLE)
    .delete()
    .eq("account_id", (data as { id: string }).id);

  if (deleteError) throw new Error(deleteError.message);
}
