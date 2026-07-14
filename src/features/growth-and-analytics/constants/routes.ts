import { GROWTH_AD_ACCOUNT_PARAM } from "./growthUrlParams";
import { teamGrowthBasePath } from "./navigation";

/** Team-default path constants (prefer useGrowthPaths() inside components). */
export const GROWTH_CAMPAIGN_ANALYTICS_PATH = `${teamGrowthBasePath}/campaigns`;

export const GROWTH_CONTENT_PERFORMANCE_PATH = `${teamGrowthBasePath}/content-performance`;

export function buildGrowthPostDetailPath(
  postId: string,
  basePath: string = teamGrowthBasePath,
): string {
  return `${basePath}/content-performance/posts/${postId}`;
}

export function buildGrowthCampaignDetailPath(
  campaignId: string,
  adAccountId?: string,
  basePath: string = teamGrowthBasePath,
): string {
  const path = `${basePath}/campaigns/${campaignId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}

export function buildGrowthAdsetDetailPath(
  campaignId: string,
  adsetId: string,
  adAccountId?: string,
  basePath: string = teamGrowthBasePath,
): string {
  const path = `${basePath}/campaigns/${campaignId}/adsets/${adsetId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}

export function buildGrowthAdDetailPath(
  campaignId: string,
  adsetId: string,
  adId: string,
  adAccountId?: string,
  basePath: string = teamGrowthBasePath,
): string {
  const path = `${basePath}/campaigns/${campaignId}/adsets/${adsetId}/ads/${adId}`;
  if (!adAccountId) return path;
  return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
}
