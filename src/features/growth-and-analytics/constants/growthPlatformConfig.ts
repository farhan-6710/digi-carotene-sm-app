import type {
  AdsAccountKind,
  GrowthPlatform,
} from "@/features/growth-and-analytics/types/types";

/** Organic social platforms stored on `growth_organic_accounts.platform`. */
export type OrganicPlatformStatus = "live" | "coming_soon";

export type OrganicPlatformConfig = {
  id: GrowthPlatform;
  label: string;
  status: OrganicPlatformStatus;
};

export type { AdsAccountKind };

/**
 * Ads account kinds stored on `growth_ads_accounts.platform`.
 * Connect UI is live for both; Campaign Analytics metrics are Meta-only until
 * Google Ads reporting is wired.
 */
export type AdsAccountKindConfig = {
  id: AdsAccountKind;
  label: string;
  /** Connect + store credentials. */
  status: OrganicPlatformStatus;
  /** Campaign Analytics charts/tables for this kind. */
  analyticsStatus: OrganicPlatformStatus;
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
    status: "live",
  },
};

export const ADS_ACCOUNT_KIND_CONFIG: Record<
  AdsAccountKind,
  AdsAccountKindConfig
> = {
  meta_ads: {
    id: "meta_ads",
    label: "Meta",
    status: "live",
    analyticsStatus: "live",
  },
  google_ads: {
    id: "google_ads",
    label: "Google",
    status: "live",
    analyticsStatus: "coming_soon",
  },
};

export function adsAccountKindLabel(kind: AdsAccountKind): string {
  return ADS_ACCOUNT_KIND_CONFIG[kind].label;
}

export function isAdsAccountKindReady(kind: AdsAccountKind): boolean {
  return ADS_ACCOUNT_KIND_CONFIG[kind].status === "live";
}

export function isAdsAnalyticsReady(kind: AdsAccountKind): boolean {
  return ADS_ACCOUNT_KIND_CONFIG[kind].analyticsStatus === "live";
}

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
