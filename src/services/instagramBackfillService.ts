import type { InstagramDbMediaType } from "@/features/growth-and-analytics/types/types";
import {
  isWithinOrganicAccBackfillWindow,
  getOrganicAccBackfillMetaRange,
} from "@/features/growth-and-analytics/utils/organicAccBackfillWindow";
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

export async function runInstagram29DayBackfill(
  profileId: string,
  instagramId: string,
  accessToken: string,
): Promise<number> {
  const profile = await fetchInstagramBackfillProfile(instagramId, accessToken);
  const media = await fetchInstagramBackfillMedia(instagramId, accessToken);
  const recentMedia = media.filter((item) =>
    isWithinOrganicAccBackfillWindow(item.timestamp),
  );

  const posts: PastPostInsert[] = [];
  for (const item of recentMedia) {
    const mediaType = mapMetaMediaTypeToDb(item.media_type, item.media_product_type);
    const insights = await fetchInstagramBackfillPostInsights(item.id, accessToken);
    posts.push(mapMediaToInsert(item, mediaType, insights));
  }

  await replacePastPostsForProfile(profileId, posts);

  const followerRange = getOrganicAccBackfillMetaRange();
  const dailyFollowers = await fetchInstagramBackfillFollowerGainByDay(
    instagramId,
    accessToken,
    followerRange,
  );
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

  return posts.length;
}

export async function rerunInstagramBackfillForOrganicAccount(
  organicAccountId: string,
  accessToken: string,
): Promise<number> {
  const profile = await fetchInstagramProfileByOrganicAccountId(organicAccountId);
  if (!profile) return 0;

  return runInstagram29DayBackfill(profile.id, profile.instagramId, accessToken);
}
