import type { GoogleCampaignKpiId } from "./googleCampaignTypeMatrix";

/** Fixed KPI summary rows on Google campaign detail (no picker). */
export const GOOGLE_CAMPAIGN_SUMMARY_KPI_IDS: GoogleCampaignKpiId[] = [
  "impressions",
  "clicks",
  "ctr",
  "spend",
  "avg_cpc",
  "conversions",
  "conversion_value",
  "cost_per_conversion",
  "conversion_rate",
  "roas",
];

/** Max metric columns in campaign daily metrics tables. */
export const DAILY_METRICS_MAX_COLUMNS = 6;

export type MetaDailyMetricColumnId =
  | "spend"
  | "impressions"
  | "reach"
  | "clicks"
  | "ctr"
  | "cpm"
  | "frequency"
  | "conversions";

/** Default daily columns — Google (same 5 + Avg. CPC). */
export const DAILY_METRICS_DEFAULT_COLUMN_IDS = [
  "spend",
  "impressions",
  "clicks",
  "ctr",
  "conversions",
  "avg_cpc",
] as const;

/** Default daily columns — Meta (same 5 + Reach). */
export const META_DAILY_METRICS_DEFAULT_COLUMN_IDS: MetaDailyMetricColumnId[] = [
  "spend",
  "impressions",
  "clicks",
  "ctr",
  "conversions",
  "reach",
];

export const META_DAILY_METRIC_COLUMNS: {
  id: MetaDailyMetricColumnId;
  label: string;
}[] = [
  { id: "spend", label: "Spend" },
  { id: "impressions", label: "Impressions" },
  { id: "reach", label: "Reach" },
  { id: "clicks", label: "Clicks" },
  { id: "ctr", label: "CTR" },
  { id: "cpm", label: "CPM" },
  { id: "frequency", label: "Freq." },
  { id: "conversions", label: "Conversions" },
];
