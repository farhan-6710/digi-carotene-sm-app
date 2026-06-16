import {
  ANALYTICS_TABS,
  ANALYTICS_TAB_PARAM,
  DEFAULT_ANALYTICS_TAB,
  type AnalyticsTabId,
} from "@/features/analytics/constants/analyticsTabs";

const validTabIds = new Set<string>(ANALYTICS_TABS.map((tab) => tab.id));

export function parseAnalyticsTab(value: string | null): AnalyticsTabId {
  if (value && validTabIds.has(value)) {
    return value as AnalyticsTabId;
  }

  return DEFAULT_ANALYTICS_TAB;
}

export function serializeAnalyticsTab(tab: AnalyticsTabId): string {
  return tab;
}

export { ANALYTICS_TAB_PARAM };
