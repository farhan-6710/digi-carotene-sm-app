import { useCallback, useMemo } from "react";

import { fetchDailyMetrics } from "@/services/growthAnalyticsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { DailyMetricRow } from "../types/types";
import {
  buildDashboardStatCards,
  buildPlatformSplit,
  buildTopAccounts,
  buildTrend,
} from "../utils/dashboardMetrics";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_METRICS: DailyMetricRow[] = [];

export function useGrowthDashboard() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const load = useCallback(() => fetchDailyMetrics(range), [range]);
  const { data, isLoading, error, reload } = useFetch<DailyMetricRow[]>(
    load,
    NO_METRICS,
  );

  useGrowthAccountsUpdated(reload);

  const statCards = useMemo(() => buildDashboardStatCards(data), [data]);
  const trend = useMemo(() => buildTrend(data), [data]);
  const platformSplit = useMemo(() => buildPlatformSplit(data), [data]);
  const topAccounts = useMemo(() => buildTopAccounts(data), [data]);

  return {
    statCards,
    trend,
    platformSplit,
    topAccounts,
    isLoading,
    error,
    dateFilterProps,
    periodLabel,
  };
}
