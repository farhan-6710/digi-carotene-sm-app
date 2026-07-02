import { useCallback, useMemo, useState } from "react";

import { fetchAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import {
  buildCampaignRows,
  buildCampaignStatCards,
  buildSpendTrend,
} from "../utils/campaignMetrics";
import { filterCampaignMetricsByRange } from "../utils/dashboardDataFilters";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { useGrowthAdAccountPicker } from "./useGrowthAdAccountPicker";
import { useGrowthDateRange } from "./useGrowthDateRange";

export function useGrowthCampaigns() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const {
    activeAccount,
    isLoading: isAccountsLoading,
    error: accountsError,
    hasAccounts,
  } = useGrowthAdAccountPicker();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const adAccountId = activeAccount?.id ?? "";
  const currencyCode = activeAccount?.currencyCode ?? "INR";

  const loadMetrics = useCallback(
    () =>
      adAccountId
        ? fetchAdCampaignMetricsForAccount(adAccountId, range)
        : Promise.resolve([]),
    [adAccountId, range],
  );
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useFetch(loadMetrics, []);

  const filteredMetrics = useMemo(
    () => filterCampaignMetricsByRange(metrics, range),
    [metrics, range],
  );

  const statCards = useMemo(
    () => buildCampaignStatCards(filteredMetrics, currencyCode),
    [filteredMetrics, currencyCode],
  );
  const spendTrend = useMemo(
    () => buildSpendTrend(filteredMetrics),
    [filteredMetrics],
  );
  const campaignRows = useMemo(
    () => buildCampaignRows(filteredMetrics),
    [filteredMetrics],
  );

  const generateReport = async () => {
    if (!activeAccount) return;

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
  };

  return {
    statCards,
    spendTrend,
    campaignRows,
    isLoading: isAccountsLoading || isMetricsLoading,
    error: accountsError || metricsError,
    dateFilterProps,
    periodLabel,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  };
}
