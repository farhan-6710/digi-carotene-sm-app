import type { GoogleCampaignKpiId } from "./googleCampaignTypeMatrix";

/** Preselected metric rows on Google campaign detail (user can change). */
export const GOOGLE_CAMPAIGN_DEFAULT_VISIBLE_KPI_IDS: GoogleCampaignKpiId[] = [
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
