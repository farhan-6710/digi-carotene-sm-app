import { useContext, useMemo } from "react";

import { GROWTH_AD_ACCOUNT_PARAM } from "../constants/growthUrlParams";
import { GrowthPortalContext } from "../providers/growthPortalContext";

export function useGrowthPortal() {
  return useContext(GrowthPortalContext);
}

/** Path helpers for the current portal (team or client). */
export function useGrowthPaths() {
  const { basePath, canManageAccounts } = useGrowthPortal();

  return useMemo(() => {
    return {
      basePath,
      canManageAccounts,
      manageAccountsPath: `${basePath}/manage-accounts`,
      campaignAnalyticsPath: `${basePath}/campaigns`,
      contentPerformancePath: `${basePath}/content-performance`,
      buildPostDetailPath: (postId: string) =>
        `${basePath}/content-performance/posts/${postId}`,
      buildCampaignDetailPath: (campaignId: string, adAccountId?: string) => {
        const path = `${basePath}/campaigns/${campaignId}`;
        if (!adAccountId) return path;
        return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
      },
      buildAdsetDetailPath: (
        campaignId: string,
        adsetId: string,
        adAccountId?: string,
      ) => {
        const path = `${basePath}/campaigns/${campaignId}/adsets/${adsetId}`;
        if (!adAccountId) return path;
        return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
      },
      buildAdDetailPath: (
        campaignId: string,
        adsetId: string,
        adId: string,
        adAccountId?: string,
      ) => {
        const path = `${basePath}/campaigns/${campaignId}/adsets/${adsetId}/ads/${adId}`;
        if (!adAccountId) return path;
        return `${path}?${GROWTH_AD_ACCOUNT_PARAM}=${adAccountId}`;
      },
    };
  }, [basePath, canManageAccounts]);
}
