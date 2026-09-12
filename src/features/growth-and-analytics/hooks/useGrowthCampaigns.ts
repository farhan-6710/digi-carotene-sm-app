import { useCallback, useMemo, useState } from "react";

import { fetchAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import { useFetch } from "@/shared/hooks/useFetch";

import { isAdsAnalyticsReady } from "../constants/growthPlatformConfig";
import {
  buildCampaignRows,
  buildCampaignStatCards,
  buildSpendTrend,
  spendTrendChartTitle,
} from "../utils/campaignMetrics";
import { filterCampaignMetricsByRange } from "../utils/dashboardDataFilters";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

export function useGrowthCampaigns() {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const {
    activeAccount,
    isLoading: isAccountsLoading,
    error: accountsError,
    hasAccounts,
  } = useGrowthSelectedAdAccount();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const adAccountId = activeAccount?.id ?? "";
  const currencyCode = activeAccount?.currencyCode ?? "INR";
  const adsPlatform = activeAccount?.platform ?? "meta_ads";
  const analyticsReady = isAdsAnalyticsReady(adsPlatform);

  const loadMetrics = useCallback(
    () =>
      adAccountId && analyticsReady
        ? fetchAdCampaignMetricsForAccount(adAccountId, range)
        : Promise.resolve([]),
    [adAccountId, analyticsReady, range],
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
    () =>
      analyticsReady
        ? buildCampaignStatCards(filteredMetrics, currencyCode)
        : [],
    [analyticsReady, filteredMetrics, currencyCode],
  );
  const spendTrend = useMemo(
    () =>
      analyticsReady
        ? buildSpendTrend(filteredMetrics)
        : { points: [], granularity: "day" as const },
    [analyticsReady, filteredMetrics],
  );
  const spendTrendTitle = spendTrendChartTitle(spendTrend.granularity);
  const campaignRows = useMemo(
    () => (analyticsReady ? buildCampaignRows(filteredMetrics) : []),
    [analyticsReady, filteredMetrics],
  );

  const generateReport = async () => {
    if (!activeAccount || !analyticsReady) return;

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
    spendTrendTitle,
    campaignRows,
    adAccountId,
    adsPlatform,
    analyticsReady,
    isLoading: isAccountsLoading || (analyticsReady && isMetricsLoading),
    error: accountsError || metricsError,
    dateFilterProps,
    periodLabel,
    generateReport,
    isGeneratingReport,
    hasAccounts,
  };
}
