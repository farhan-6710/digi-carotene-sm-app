import type { GrowthPostDetailView, PastPostMetric } from "../types/types";
import { calcPostEngagementRate, mapDbMediaTypeToUi } from "./instagramPostMetrics";

export function buildGrowthPostDetailView(
  post: PastPostMetric,
  accountUsername: string,
  neighbors: { previousPostId: string | null; nextPostId: string | null },
): GrowthPostDetailView {
  return {
    post,
    accountUsername,
    mediaTypeLabel: mapDbMediaTypeToUi(post.mediaType),
    engagementRate: calcPostEngagementRate(post),
    previousPostId: neighbors.previousPostId,
    nextPostId: neighbors.nextPostId,
  };
}
