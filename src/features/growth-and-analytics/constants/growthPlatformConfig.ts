import type { GrowthPlatform } from "@/features/growth-and-analytics/types/types";

/** Organic social platforms stored on `growth_organic_accounts.platform`. */
export type OrganicPlatformStatus = "live" | "coming_soon";

export type OrganicPlatformConfig = {
  id: GrowthPlatform;
  label: string;
  status: OrganicPlatformStatus;
};

/**
 * Ads account kinds. Meta ads are live today; Google Ads is reserved for a
 * later table / connect flow (no DB work in this pass).
 */
export type AdsAccountKind = "meta_ads" | "google_ads";

export type AdsAccountKindConfig = {
  id: AdsAccountKind;
  label: string;
  status: OrganicPlatformStatus;
};

export type GrowthAccountSelectorKind = "organic" | "ads" | "all" | "none";

export type GrowthSurfaceId =
  | "dashboard"
  | "content_performance"
  | "campaign_analytics"
  | "custom_report"
  | "reports"
  | "manage_accounts";

export const ORGANIC_PLATFORM_CONFIG: Record<
  GrowthPlatform,
  OrganicPlatformConfig
> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    status: "live",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    status: "coming_soon",
  },
};

export const ADS_ACCOUNT_KIND_CONFIG: Record<
  AdsAccountKind,
  AdsAccountKindConfig
> = {
  meta_ads: {
    id: "meta_ads",
    label: "Meta Ads",
    status: "live",
  },
  // Future: connect Google Ads accounts into Growth (separate from Meta ads).
  google_ads: {
    id: "google_ads",
    label: "Google Ads",
    status: "coming_soon",
  },
};

/** Which account selector each Growth surface should present. */
export const GROWTH_SURFACE_ACCOUNT_SELECTOR: Record<
  GrowthSurfaceId,
  GrowthAccountSelectorKind
> = {
  dashboard: "organic",
  content_performance: "organic",
  campaign_analytics: "ads",
  custom_report: "all",
  reports: "all",
  manage_accounts: "none",
};

export function isOrganicPlatformReady(platform: GrowthPlatform): boolean {
  return ORGANIC_PLATFORM_CONFIG[platform].status === "live";
}

export type OrganicDashboardMode = "live" | "coming_soon";

export function getOrganicDashboardMode(
  platform: GrowthPlatform | null | undefined,
): OrganicDashboardMode {
  if (!platform) return "coming_soon";
  return isOrganicPlatformReady(platform) ? "live" : "coming_soon";
}

export function organicPlatformLabel(platform: GrowthPlatform): string {
  return ORGANIC_PLATFORM_CONFIG[platform].label;
}
