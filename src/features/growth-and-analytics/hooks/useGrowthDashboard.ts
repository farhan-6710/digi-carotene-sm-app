import { useCallback, useMemo } from "react";

import { fetchOrganicAccounts } from "@/services/growthAccountsService";
import { fetchLiveDailyMetrics } from "@/services/growthLiveMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { DailyMetricRow, OrganicAccount } from "../types/types";
import {
  buildDashboardStatCards,
  buildPlatformSplit,
  buildTopAccounts,
  buildTrend,
} from "../utils/dashboardMetrics";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_METRICS: DailyMetricRow[] = [];
const NO_ACCOUNTS: OrganicAccount[] = [];

export function useGrowthDashboard() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const load = useCallback(() => fetchLiveDailyMetrics(range), [range]);
  const loadAccounts = useCallback(() => fetchOrganicAccounts(), []);
  const { data, isLoading, error, reload } = useFetch<DailyMetricRow[]>(
    load,
    NO_METRICS,
  );
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    reload: reloadAccounts,
  } = useFetch<OrganicAccount[]>(loadAccounts, NO_ACCOUNTS);

  useGrowthAccountsUpdated(async () => {
    await reload();
    await reloadAccounts();
  });

  const statCards = useMemo(() => buildDashboardStatCards(data, accounts), [data, accounts]);
  const trend = useMemo(() => buildTrend(data), [data]);
  const platformSplit = useMemo(
    () => buildPlatformSplit(data, accounts),
    [data, accounts],
  );
  const topAccounts = useMemo(
    () => buildTopAccounts(data, accounts),
    [data, accounts],
  );

  return {
    statCards,
    trend,
    platformSplit,
    topAccounts,
    isLoading: isLoading || isAccountsLoading,
    error,
    dateFilterProps,
    periodLabel,
  };
}
