import { clearAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import { clearAdMetricsForAccount } from "@/services/adMetricsService";
import { clearAdsetMetricsForAccount } from "@/services/adsetMetricsService";
import { clearAdsForAccount } from "@/services/adsService";
import { clearAdsetsForAccount } from "@/services/adsetsService";
import { clearPastPostsForOrganicAccount } from "@/services/pastPostsMetricsService";

/** Clears stored post metrics after a token refresh (re-backfill runs separately). */
export async function clearOrganicCachedMetrics(accountId: string): Promise<void> {
  await clearPastPostsForOrganicAccount(accountId);
}

export async function clearAdCachedMetrics(adAccountId: string): Promise<void> {
  await Promise.all([
    clearAdCampaignMetricsForAccount(adAccountId),
    clearAdsetMetricsForAccount(adAccountId),
    clearAdMetricsForAccount(adAccountId),
    clearAdsetsForAccount(adAccountId),
    clearAdsForAccount(adAccountId),
  ]);
}
