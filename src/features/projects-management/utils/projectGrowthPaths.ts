import {
  clientGrowthBasePath,
  teamGrowthBasePath,
} from "@/features/growth-and-analytics/constants/navigation";
import {
  GROWTH_AD_ACCOUNT_PARAM,
  GROWTH_ORGANIC_ACCOUNT_PARAM,
} from "@/features/growth-and-analytics/constants/growthUrlParams";

export function buildProjectContentPerformancePath(
  portal: "team" | "client",
  organicAccountId: string,
): string {
  const base =
    portal === "team" ? teamGrowthBasePath : clientGrowthBasePath;
  return `${base}/content-performance?${GROWTH_ORGANIC_ACCOUNT_PARAM}=${encodeURIComponent(organicAccountId)}`;
}

export function buildProjectCampaignAnalyticsPath(
  portal: "team" | "client",
  adAccountId: string,
): string {
  const base =
    portal === "team" ? teamGrowthBasePath : clientGrowthBasePath;
  return `${base}/campaigns?${GROWTH_AD_ACCOUNT_PARAM}=${encodeURIComponent(adAccountId)}`;
}
