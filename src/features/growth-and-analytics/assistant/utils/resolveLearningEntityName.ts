import { fetchAdCampaignMetricsByCampaignId } from "@/services/adCampaignMetricsService";
import { fetchAdById } from "@/services/adsService";
import { fetchAdsetById } from "@/services/adsetsService";
import type { LearningFocus } from "../constants/learningAnalysis";

/** Resolve a human label for the Learning entity Pulse is analysing. */
export async function resolveLearningEntityName(
  focus: LearningFocus,
): Promise<string> {
  if (!focus.adAccountId) return "";

  if (focus.kind === "ad" && focus.adId) {
    const ad = await fetchAdById(focus.adAccountId, focus.adId);
    return ad?.adName?.trim() || "";
  }

  if (focus.kind === "adset" && focus.adsetId) {
    const adset = await fetchAdsetById(focus.adAccountId, focus.adsetId);
    return adset?.adsetName?.trim() || "";
  }

  const rows = await fetchAdCampaignMetricsByCampaignId(
    focus.adAccountId,
    focus.campaignId,
  );
  return rows[0]?.campaignName?.trim() || "";
}
