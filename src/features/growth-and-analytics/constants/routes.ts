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

export function buildGrowthAdsetDetailPath(
  campaignId: string,
  adsetId: string,
  adAccountId?: string,
): string {
  const path = `${GROWTH_CAMPAIGN_ANALYTICS_PATH}/${campaignId}/adsets/${adsetId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}

export function buildGrowthAdDetailPath(
  campaignId: string,
  adsetId: string,
  adId: string,
  adAccountId?: string,
): string {
  const path = `${GROWTH_CAMPAIGN_ANALYTICS_PATH}/${campaignId}/adsets/${adsetId}/ads/${adId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}
