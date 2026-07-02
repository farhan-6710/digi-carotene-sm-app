import { GROWTH_AD_ACCOUNT_PARAM } from "./growthUrlParams";
import { growthBasePath } from "./navigation";

export const GROWTH_CAMPAIGN_ANALYTICS_PATH = `${growthBasePath}/campaigns`;

export const GROWTH_CONTENT_PERFORMANCE_PATH = `${growthBasePath}/content-performance`;

export function buildGrowthPostDetailPath(postId: string): string {
  return `${GROWTH_CONTENT_PERFORMANCE_PATH}/posts/${postId}`;
}

export function buildGrowthCampaignDetailPath(
  campaignId: string,
  adAccountId?: string,
): string {
  const path = `${GROWTH_CAMPAIGN_ANALYTICS_PATH}/${campaignId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}
