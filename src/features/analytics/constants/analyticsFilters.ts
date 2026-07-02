export const ANALYTICS_PERIOD_PARAM = "period";
export const ANALYTICS_FROM_PARAM = "from";
export const ANALYTICS_TO_PARAM = "to";

export const ANALYTICS_QUICK_PERIODS = [
  { id: "7d", label: "7D" },
  { id: "1m", label: "1M" },
  { id: "3m", label: "3M" },
  // Temporarily hidden until longer history is synced (Growth & Analytics).
  // { id: "6m", label: "6M" },
  // { id: "9m", label: "9M" },
  // { id: "1y", label: "1Y" },
] as const;

export type AnalyticsQuickPeriodId =
  (typeof ANALYTICS_QUICK_PERIODS)[number]["id"];
