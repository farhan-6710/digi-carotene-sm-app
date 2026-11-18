import {
  GROWTH_AD_ACCOUNT_PARAM,
  GROWTH_ORGANIC_ACCOUNT_PARAM,
} from "../../constants/shared/growthUrlParams";

/** Stable sessionStorage key for one Pulse thread (entity-scoped). */
export function resolveAssistantChatScope(input: {
  searchParams: URLSearchParams;
  campaignId: string;
  adsetId: string;
  adId: string;
  postId: string;
}): string {
  const adAccountId = input.searchParams.get(GROWTH_AD_ACCOUNT_PARAM)?.trim() ?? "";
  const organicAccountId =
    input.searchParams.get(GROWTH_ORGANIC_ACCOUNT_PARAM)?.trim() ?? "";

  if (input.postId) return `organic:post:${input.postId}`;

  if (input.adId && input.campaignId) {
    return [
      "ad",
      adAccountId || "-",
      "campaign",
      input.campaignId,
      "adset",
      input.adsetId || "-",
      "ad",
      input.adId,
    ].join(":");
  }

  if (input.adsetId && input.campaignId) {
    return [
      "ad",
      adAccountId || "-",
      "campaign",
      input.campaignId,
      "adset",
      input.adsetId,
    ].join(":");
  }

  if (input.campaignId) {
    return ["ad", adAccountId || "-", "campaign", input.campaignId].join(":");
  }

  if (adAccountId) return `ad:${adAccountId}`;
  if (organicAccountId) return `organic:${organicAccountId}`;
  return "general";
}
