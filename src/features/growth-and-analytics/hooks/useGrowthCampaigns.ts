import { useCallback, useMemo, useState } from "react";

import { fetchAdAccounts } from "@/services/growthAccountsService";
import { fetchCampaignMetrics } from "@/services/growthAnalyticsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { AdAccount, CampaignMetricRow } from "../types/types";
import {
  buildCampaignRows,
  buildCampaignStatCards,
  buildSpendTrend,
} from "../utils/campaignMetrics";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_ACCOUNTS: AdAccount[] = [];
const NO_METRICS: CampaignMetricRow[] = [];

export function useGrowthCampaigns() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const loadAccounts = useCallback(() => fetchAdAccounts(), []);
  const { data: accounts } = useFetch<AdAccount[]>(loadAccounts, NO_ACCOUNTS);

  const [selectedId, setSelectedId] = useState("");
  const activeAccount =
    accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const adAccountId = activeAccount?.id ?? "";
  const currency = activeAccount?.currency ?? "INR";

  const loadCampaigns = useCallback(
    () =>
      adAccountId
        ? fetchCampaignMetrics(adAccountId, range)
        : Promise.resolve(NO_METRICS),
    [adAccountId, range],
  );
  const {
    data: metrics,
    isLoading,
    error,
  } = useFetch<CampaignMetricRow[]>(loadCampaigns, NO_METRICS);

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: `${account.accountName} (${account.currency})`,
      })),
    [accounts],
  );

  const statCards = useMemo(
    () => buildCampaignStatCards(metrics, currency),
    [metrics, currency],
  );
  const spendTrend = useMemo(() => buildSpendTrend(metrics), [metrics]);
  const campaignRows = useMemo(() => buildCampaignRows(metrics), [metrics]);

  return {
    accountOptions,
    adAccountId,
    setAdAccountId: setSelectedId,
    statCards,
    spendTrend,
    campaignRows,
    isLoading,
    error,
    dateFilterProps,
    periodLabel,
  };
}
