import type {
  AdAccountKind,
  GrowthPlatform,
} from "@/features/growth-and-analytics/types/types";

/** Organic social platforms stored on `growth_organic_accounts.platform`. */
export type OrganicPlatformStatus = "live" | "coming_soon";

export type OrganicPlatformConfig = {
  id: GrowthPlatform;
  label: string;
  status: OrganicPlatformStatus;
};

export type { AdAccountKind };

/**
 * Ad account kinds stored on `growth_ad_accounts.platform`.
 * Connect + Campaign Analytics are live for Meta and Google.
 */
export type AdAccountKindConfig = {
  id: AdAccountKind;
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

export const AD_ACCOUNT_KIND_CONFIG: Record<
  AdAccountKind,
  AdAccountKindConfig
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
    analyticsStatus: "live",
  },
};

export function adAccountKindLabel(kind: AdAccountKind): string {
  return AD_ACCOUNT_KIND_CONFIG[kind].label;
}

export function isAdAccountKindReady(kind: AdAccountKind): boolean {
  return AD_ACCOUNT_KIND_CONFIG[kind].status === "live";
}

export function isAdAnalyticsReady(kind: AdAccountKind): boolean {
  return AD_ACCOUNT_KIND_CONFIG[kind].analyticsStatus === "live";
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

/** Text color for platform badges in account comboboxes. */
export const ORGANIC_PLATFORM_BADGE_CLASS: Record<GrowthPlatform, string> = {
  instagram: "text-[#E1306C]",
  facebook: "text-[#1877F2]",
};

export const AD_PLATFORM_BADGE_CLASS: Record<AdAccountKind, string> = {
  meta_ads: "text-[#1877F2]",
  google_ads: "text-[#34A853]",
};

export const ORGANIC_PLATFORM_LIST_ORDER: GrowthPlatform[] = [
  "instagram",
  "facebook",
];

export const AD_PLATFORM_LIST_ORDER: AdAccountKind[] = [
  "meta_ads",
  "google_ads",
];
