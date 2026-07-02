import { clearAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import { clearPastPostsForOrganicAccount } from "@/services/pastPostsMetricsService";

/** Clears stored post metrics after a token refresh (re-backfill runs separately). */
export async function clearOrganicCachedMetrics(accountId: string): Promise<void> {
  await clearPastPostsForOrganicAccount(accountId);
}

export async function clearAdCachedMetrics(adAccountId: string): Promise<void> {
  await clearAdCampaignMetricsForAccount(adAccountId);
}
