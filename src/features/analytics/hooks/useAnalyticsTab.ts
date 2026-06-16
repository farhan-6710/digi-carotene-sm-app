import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  DEFAULT_ANALYTICS_TAB,
  type AnalyticsTabId,
} from "@/features/analytics/constants/analyticsTabs";
import {
  ANALYTICS_TAB_PARAM,
  parseAnalyticsTab,
  serializeAnalyticsTab,
} from "@/features/analytics/utils/analyticsUrlParams";

export function useAnalyticsTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = useMemo(
    () => parseAnalyticsTab(searchParams.get(ANALYTICS_TAB_PARAM)),
    [searchParams],
  );

  const setActiveTab = useCallback(
    (tab: AnalyticsTabId) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(ANALYTICS_TAB_PARAM, serializeAnalyticsTab(tab));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!searchParams.has(ANALYTICS_TAB_PARAM)) {
      setActiveTab(DEFAULT_ANALYTICS_TAB);
    }
  }, [searchParams, setActiveTab]);

  return { activeTab, setActiveTab };
}
