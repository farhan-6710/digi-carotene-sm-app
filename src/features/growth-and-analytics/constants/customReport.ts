import type { AdAccountKind, GrowthPlatform } from "../types/types";

/** Matches Content Performance “Last 3 Months” (~93 days). */
export const CUSTOM_REPORT_MAX_DAYS = 93;

/** Cap accounts per PDF. */
export const CUSTOM_REPORT_MAX_ACCOUNTS = 5;

/** Top posts listed per organic account section. */
export const CUSTOM_REPORT_TOP_POSTS = 5;

export type CustomReportKind = "organic" | "ad";

/** Same presets as Growth Content Performance / Campaign Analytics. */
export type CustomReportPeriodId =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "custom";

export const CUSTOM_REPORT_PERIOD_OPTIONS: {
  id: CustomReportPeriodId;
  label: string;
}[] = [
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "last_3_months", label: "Last 3 months" },
  { id: "custom", label: "Custom range" },
];

export const ORGANIC_PLATFORM_ORDER: GrowthPlatform[] = [
  "instagram",
  "facebook",
];

export const AD_PLATFORM_ORDER: AdAccountKind[] = ["meta_ads", "google_ads"];
