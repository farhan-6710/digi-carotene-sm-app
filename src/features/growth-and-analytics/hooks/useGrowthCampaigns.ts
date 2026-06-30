import { useCallback, useMemo, useState } from "react";

import { fetchAdAccounts } from "@/services/growthAccountsService";
import { fetchLiveCampaignMetrics } from "@/services/growthLiveMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";
import { showToast } from "@/shared/utils/showToast";

import type { AdAccount, CampaignMetricRow } from "../types/types";
import {
  buildCampaignRows,
  buildCampaignStatCards,
  buildSpendTrend,
} from "../utils/campaignMetrics";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";
import { useGrowthDateRange } from "./useGrowthDateRange";

const NO_ACCOUNTS: AdAccount[] = [];
const NO_METRICS: CampaignMetricRow[] = [];

export function useGrowthCampaigns() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();

  const loadAccounts = useCallback(() => fetchAdAccounts(), []);
  const { data: accounts, reload: reloadAccounts } = useFetch<AdAccount[]>(
    loadAccounts,
    NO_ACCOUNTS,
  );

  const [selectedId, setSelectedId] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const activeAccount =
    accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const adAccountId = activeAccount?.id ?? "";
  const currency = activeAccount?.currency ?? "INR";

  const loadCampaigns = useCallback(
    () =>
      adAccountId
        ? fetchLiveCampaignMetrics(adAccountId, range)
        : Promise.resolve(NO_METRICS),
    [adAccountId, range],
  );
  const {
    data: metrics,
    isLoading,
    error,
    reload: reloadMetrics,
  } = useFetch<CampaignMetricRow[]>(loadCampaigns, NO_METRICS);

  useGrowthAccountsUpdated(async () => {
    await reloadAccounts();
    await reloadMetrics();
  });

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

  const generateReport = useCallback(async () => {
    if (!activeAccount) {
      showToast("error", "Connect an ad account before generating a report.");
      return;
    }

    const { periodStart, periodEnd } = resolveGrowthReportPeriod(range);
    setIsGeneratingReport(true);
    try {
      await saveGrowthReport({
        title: `${activeAccount.accountName} — Campaign Analytics`,
        type: "campaigns",
        platform: "campaigns",
        periodStart,
        periodEnd,
      });
    } finally {
      setIsGeneratingReport(false);
    }
  }, [activeAccount, range]);

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
    generateReport,
    isGeneratingReport,
    hasAccounts: accounts.length > 0,
  };
}
