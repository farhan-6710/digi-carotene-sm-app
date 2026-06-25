export const ANALYTICS_TAB_PARAM = "tab";

export const ANALYTICS_TABS = [
  { id: "posts", label: "Posts" },
  { id: "clients", label: "Clients" },
  { id: "employees", label: "Team" },
  { id: "agency", label: "Agency" },
] as const;

export type AnalyticsTabId = (typeof ANALYTICS_TABS)[number]["id"];

export const DEFAULT_ANALYTICS_TAB: AnalyticsTabId = "posts";

export function buildAnalyticsPath(tab: AnalyticsTabId = DEFAULT_ANALYTICS_TAB) {
  return `/team-portal/analytics?${ANALYTICS_TAB_PARAM}=${tab}`;
}
