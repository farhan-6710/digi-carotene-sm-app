import type { InstagramDbMediaType } from "@/features/growth-and-analytics/types/types";
import {
  assertBackfillNotAborted,
  reportBackfillProgress,
  type BackfillProgressOptions,
} from "@/features/growth-and-analytics/utils/backfillProgress";
import { isWithinOrganicAccBackfillWindow } from "@/features/growth-and-analytics/utils/organicAccBackfillWindow";
import { getMetaFollowerCountSyncRange } from "@/features/growth-and-analytics/utils/metaSyncMappers";
import {
  fetchInstagramBackfillMedia,
  fetchInstagramBackfillPostInsights,
  fetchInstagramBackfillProfile,
  fetchInstagramBackfillFollowerGainByDay,
  type IgBackfillMediaItem,
} from "@/services/metaService";
import {
  fetchInstagramProfileByOrganicAccountId,
  updateInstagramProfileToken,
} from "@/services/instagramProfilesService";
import { replaceDailyFollowersForProfile } from "@/services/instagramDailyFollowersService";
import {
  replacePastPostsForProfile,
  type PastPostInsert,
} from "@/services/pastPostsMetricsService";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

function mapMetaMediaTypeToDb(
  mediaType?: string,
  productType?: string,
): InstagramDbMediaType {
  if (productType === "REELS" || mediaType === "REELS") return "REEL";
  if (mediaType === "CAROUSEL_ALBUM") return "CAROUSEL";
  if (mediaType === "VIDEO") return "VIDEO";
  return "IMAGE";
}

function resolvePostThumbnail(
  item: IgBackfillMediaItem,
  mediaType: InstagramDbMediaType,
): string | null {
  if (mediaType === "IMAGE" || mediaType === "CAROUSEL") {
    return item.media_url?.trim() || null;
  }
  if (mediaType === "REEL" || mediaType === "VIDEO") {
    return item.thumbnail_url?.trim() || item.media_url?.trim() || null;
  }
  return null;
}

function mapMediaToInsert(
  item: IgBackfillMediaItem,
  mediaType: InstagramDbMediaType,
  insights: { reach: number; impressions: number; saves: number; shares: number; reposts: number },
): PastPostInsert {
  return {
    postId: item.id,
    caption: item.caption?.trim() || "(No caption)",
    mediaType,
    createdAt: item.timestamp ?? new Date().toISOString(),
    reach: insights.reach,
    impressions: insights.impressions,
    likes: item.like_count ?? 0,
    comments: item.comments_count ?? 0,
    saves: insights.saves,
    shares: insights.shares,
    reposts: insights.reposts,
    postThumbnail: resolvePostThumbnail(item, mediaType),
  };
}

async function touchOrganicAccountLastSynced(
  organicAccountId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", organicAccountId);

  if (error) throw new Error(error.message);
}

/** Backfill/refetch Instagram posts (90d) + follower gains (Meta 30d cap). */
export async function runInstagramBackfill(
  profileId: string,
  instagramId: string,
  accessToken: string,
  organicAccountId: string,
  options?: BackfillProgressOptions,
): Promise<number> {
  assertBackfillNotAborted(options?.signal);

  reportBackfillProgress(options, {
    completed: 0,
    total: 1,
    label: "Reading your Instagram profile…",
  });

  const profile = await fetchInstagramBackfillProfile(instagramId, accessToken);
  assertBackfillNotAborted(options?.signal);

  const media = await fetchInstagramBackfillMedia(instagramId, accessToken);
  assertBackfillNotAborted(options?.signal);

  const recentMedia = media.filter((item) =>
    isWithinOrganicAccBackfillWindow(item.timestamp),
  );

  const total = recentMedia.length + 1;
  reportBackfillProgress(options, {
    completed: 0,
    total,
    label: "Updating recent posts…",
  });

  const posts: PastPostInsert[] = [];
  for (let index = 0; index < recentMedia.length; index += 1) {
    assertBackfillNotAborted(options?.signal);
    const item = recentMedia[index];
    const mediaType = mapMetaMediaTypeToDb(item.media_type, item.media_product_type);
    const insights = await fetchInstagramBackfillPostInsights(item.id, accessToken);
    posts.push(mapMediaToInsert(item, mediaType, insights));
    reportBackfillProgress(options, {
      completed: index + 1,
      total,
      label: "Updating recent posts…",
    });
  }

  assertBackfillNotAborted(options?.signal);
  await replacePastPostsForProfile(profileId, posts);

  reportBackfillProgress(options, {
    completed: Math.max(total - 1, 0),
    total,
    label: "Updating follower history…",
  });

  const followerRange = getMetaFollowerCountSyncRange();
  const dailyFollowers = await fetchInstagramBackfillFollowerGainByDay(
    instagramId,
    accessToken,
    followerRange,
  );
  assertBackfillNotAborted(options?.signal);

  await replaceDailyFollowersForProfile(
    profileId,
    dailyFollowers,
    followerRange.from,
    followerRange.to,
  );

  await updateInstagramProfileToken(
    profileId,
    accessToken,
    profile.followersCount,
    profile.username,
  );

  await touchOrganicAccountLastSynced(organicAccountId);

  reportBackfillProgress(options, {
    completed: total,
    total,
    label: "All set — finishing up…",
  });

  return posts.length;
}

export async function rerunInstagramBackfillForOrganicAccount(
  organicAccountId: string,
  accessToken: string,
  options?: BackfillProgressOptions,
): Promise<number> {
  const profile = await fetchInstagramProfileByOrganicAccountId(organicAccountId);
  if (!profile) return 0;

  return runInstagramBackfill(
    profile.id,
    profile.instagramId,
    accessToken,
    organicAccountId,
    options,
  );
}
