import { useCallback, useMemo, useState } from "react";

import { fetchOrganicAccounts } from "@/services/growthAccountsService";
import { fetchLiveDailyMetricsForAccount } from "@/services/growthLiveMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { DailyMetricRow, OrganicAccount } from "../types/types";
import {
  buildDashboardStatCards,
  buildPlatformSplit,
  buildTrend,
} from "../utils/dashboardMetrics";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_METRICS: DailyMetricRow[] = [];
const NO_ACCOUNTS: OrganicAccount[] = [];

function platformLabel(account: OrganicAccount): string {
  return account.platform === "instagram" ? "Instagram" : "Facebook";
}

export function useGrowthDashboard() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const loadAccounts = useCallback(() => fetchOrganicAccounts(), []);
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    reload: reloadAccounts,
  } = useFetch<OrganicAccount[]>(loadAccounts, NO_ACCOUNTS);

  const [selectedId, setSelectedId] = useState("");
  const activeAccount =
    accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const accountId = activeAccount?.id ?? "";

  const load = useCallback(
    () =>
      accountId
        ? fetchLiveDailyMetricsForAccount(accountId, range)
        : Promise.resolve(NO_METRICS),
    [accountId, range],
  );
  const { data, isLoading, error, reload } = useFetch<DailyMetricRow[]>(
    load,
    NO_METRICS,
  );

  useGrowthAccountsUpdated(async () => {
    await reloadAccounts();
    await reload();
  });

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.accountName} (${platformLabel(account)})`,
      })),
    [accounts],
  );

  const statCards = useMemo(
    () => buildDashboardStatCards(data, activeAccount),
    [data, activeAccount],
  );
  const trend = useMemo(() => buildTrend(data), [data]);
  const platformSplit = useMemo(
    () => buildPlatformSplit(activeAccount),
    [activeAccount],
  );

  return {
    accountOptions,
    accountId,
    setAccountId: setSelectedId,
    statCards,
    trend,
    platformSplit,
    isLoading: isLoading || isAccountsLoading,
    error,
    dateFilterProps,
    periodLabel,
    hasAccounts: accounts.length > 0,
  };
}
