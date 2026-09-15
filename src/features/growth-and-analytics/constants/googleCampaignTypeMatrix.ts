/**
 * Google Ads campaign-type KPI matrix from google_ads_kpi_columns.xlsx
 * (Campaign Type Matrix sheet). An "X" in the sheet = field applies.
 */

export type GoogleCampaignTypeId =
  | "search"
  | "performance_max"
  | "display"
  | "demand_gen"
  | "video"
  | "shopping"
  | "local_call"
  | "app"
  | "unknown";

/** KPI keys we can show in the UI (Phase 1 synced + computed). */
export type GoogleCampaignKpiId =
  | "impressions"
  | "clicks"
  | "ctr"
  | "spend"
  | "avg_cpc"
  | "conversions"
  | "conversion_value"
  | "cost_per_conversion"
  | "conversion_rate"
  | "roas"
  | "search_impression_share"
  | "search_lost_is_budget"
  | "search_lost_is_rank"
  | "viewability_rate"
  | "avg_cpm"
  | "video_views"
  | "avg_cpv"
  | "video_quartile"
  | "call_count"
  | "call_duration"
  | "direction_requests"
  | "local_shop_visits"
  | "local_website_visits"
  | "local_direction_views"
  | "local_calls"
  | "local_orders"
  | "local_menu_views"
  | "local_other_actions"
  | "quality_score"
  | "installs";

export type GoogleCampaignKpiPhase = 1 | 2 | 3 | 4;

export type GoogleCampaignKpiDef = {
  id: GoogleCampaignKpiId;
  label: string;
  /** Sheet phase — Phase 1 fields are synced/computed today. */
  phase: GoogleCampaignKpiPhase;
  /** true = derive from spend/clicks/impressions/conversions in the app. */
  computed: boolean;
  /**
   * true = we can render a value from synced growth_ads_* campaign rows
   * (or compute it). Call / Quality Score / installs stay false until wired.
   */
  renderableToday: boolean;
  format: "currency" | "percent" | "compact" | "number";
};

/** Channel types as stored from GAQL `campaign.advertisingChannelType`. */
export const GOOGLE_CHANNEL_TO_TYPE: Record<string, GoogleCampaignTypeId> = {
  SEARCH: "search",
  PERFORMANCE_MAX: "performance_max",
  DISPLAY: "display",
  DEMAND_GEN: "demand_gen",
  VIDEO: "video",
  SHOPPING: "shopping",
  LOCAL: "local_call",
  LOCAL_SERVICES: "local_call",
  SMART: "local_call",
  MULTI_CHANNEL: "app",
};

export const GOOGLE_CAMPAIGN_TYPE_LABEL: Record<GoogleCampaignTypeId, string> = {
  search: "Search",
  performance_max: "Performance Max",
  display: "Display",
  demand_gen: "Demand Gen",
  video: "Video",
  shopping: "Shopping",
  local_call: "Local / Call",
  app: "App",
  unknown: "Campaign",
};

export const GOOGLE_CAMPAIGN_KPI_DEFS: Record<
  GoogleCampaignKpiId,
  GoogleCampaignKpiDef
> = {
  impressions: {
    id: "impressions",
    label: "Impressions",
    phase: 1,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  clicks: {
    id: "clicks",
    label: "Clicks",
    phase: 1,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  ctr: {
    id: "ctr",
    label: "CTR",
    phase: 1,
    computed: true,
    renderableToday: true,
    format: "percent",
  },
  spend: {
    id: "spend",
    label: "Cost",
    phase: 1,
    computed: false,
    renderableToday: true,
    format: "currency",
  },
  avg_cpc: {
    id: "avg_cpc",
    label: "Avg. CPC",
    phase: 1,
    computed: true,
    renderableToday: true,
    format: "currency",
  },
  conversions: {
    id: "conversions",
    label: "Conversions",
    phase: 1,
    computed: false,
    renderableToday: true,
    format: "number",
  },
  conversion_value: {
    id: "conversion_value",
    label: "Conversion value",
    phase: 1,
    computed: false,
    renderableToday: true,
    format: "currency",
  },
  cost_per_conversion: {
    id: "cost_per_conversion",
    label: "Cost / conversion",
    phase: 1,
    computed: true,
    renderableToday: true,
    format: "currency",
  },
  conversion_rate: {
    id: "conversion_rate",
    label: "Conversion rate",
    phase: 1,
    computed: true,
    renderableToday: true,
    format: "percent",
  },
  roas: {
    id: "roas",
    label: "ROAS",
    phase: 1,
    computed: true,
    renderableToday: true,
    format: "number",
  },
  search_impression_share: {
    id: "search_impression_share",
    label: "Search impression share",
    phase: 2,
    computed: false,
    renderableToday: true,
    format: "percent",
  },
  search_lost_is_budget: {
    id: "search_lost_is_budget",
    label: "Search lost IS (budget)",
    phase: 2,
    computed: false,
    renderableToday: true,
    format: "percent",
  },
  search_lost_is_rank: {
    id: "search_lost_is_rank",
    label: "Search lost IS (rank)",
    phase: 2,
    computed: false,
    renderableToday: true,
    format: "percent",
  },
  viewability_rate: {
    id: "viewability_rate",
    label: "Viewability rate",
    phase: 4,
    computed: false,
    renderableToday: true,
    format: "percent",
  },
  avg_cpm: {
    id: "avg_cpm",
    label: "Avg. CPM",
    phase: 4,
    computed: false,
    renderableToday: true,
    format: "currency",
  },
  video_views: {
    id: "video_views",
    label: "Video views",
    phase: 4,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  avg_cpv: {
    id: "avg_cpv",
    label: "Avg. CPV",
    phase: 4,
    computed: false,
    renderableToday: true,
    format: "currency",
  },
  video_quartile: {
    id: "video_quartile",
    label: "Video completion (100%)",
    phase: 4,
    computed: false,
    renderableToday: true,
    format: "percent",
  },
  call_count: {
    id: "call_count",
    label: "Calls",
    phase: 3,
    computed: false,
    renderableToday: false,
    format: "compact",
  },
  call_duration: {
    id: "call_duration",
    label: "Call duration",
    phase: 3,
    computed: false,
    renderableToday: false,
    format: "number",
  },
  direction_requests: {
    id: "direction_requests",
    label: "Direction requests",
    phase: 4,
    computed: false,
    renderableToday: false,
    format: "compact",
  },
  local_shop_visits: {
    id: "local_shop_visits",
    label: "Shop visits",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_website_visits: {
    id: "local_website_visits",
    label: "Local website visits",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_direction_views: {
    id: "local_direction_views",
    label: "Direction views",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_calls: {
    id: "local_calls",
    label: "Local action calls",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_orders: {
    id: "local_orders",
    label: "Local action orders",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_menu_views: {
    id: "local_menu_views",
    label: "Menu views",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  local_other_actions: {
    id: "local_other_actions",
    label: "Other local actions",
    phase: 3,
    computed: false,
    renderableToday: true,
    format: "compact",
  },
  quality_score: {
    id: "quality_score",
    label: "Quality Score",
    phase: 4,
    computed: false,
    renderableToday: false,
    format: "number",
  },
  installs: {
    id: "installs",
    label: "Installs",
    phase: 4,
    computed: false,
    renderableToday: false,
    format: "compact",
  },
};

/**
 * Matrix columns from the sheet: which KPI applies to which campaign type.
 * Order matches the spreadsheet rows.
 */
export const GOOGLE_CAMPAIGN_TYPE_KPIS: Record<
  Exclude<GoogleCampaignTypeId, "unknown">,
  GoogleCampaignKpiId[]
> = {
  search: [
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
    "search_impression_share",
    "search_lost_is_budget",
    "search_lost_is_rank",
    "quality_score",
  ],
  performance_max: [
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
  ],
  display: [
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
    "viewability_rate",
    "avg_cpm",
  ],
  demand_gen: [
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
    "avg_cpm",
  ],
  video: [
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
    "avg_cpm",
    "video_views",
    "avg_cpv",
    "video_quartile",
  ],
  shopping: [
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
    "search_impression_share",
  ],
  local_call: [
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
    "local_shop_visits",
    "local_website_visits",
    "local_direction_views",
    "local_calls",
    "local_orders",
    "local_menu_views",
    "local_other_actions",
  ],
  app: [
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
    "installs",
  ],
};

/** Hierarchy label under a campaign (ad group vs asset group). */
export function googleCampaignChildEntityLabel(
  typeId: GoogleCampaignTypeId,
): { plural: string; singular: string } {
  if (typeId === "performance_max") {
    return { plural: "Asset groups", singular: "Asset group" };
  }
  return { plural: "Ad groups", singular: "Ad group" };
}
