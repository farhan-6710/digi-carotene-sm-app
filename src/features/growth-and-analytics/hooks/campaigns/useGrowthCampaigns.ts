import { useCallback, useMemo, useState } from "react";

import { fetchAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import { fetchActiveBenchmarksForAccount } from "@/services/campaignLearningService";
import { useFetch } from "@/shared/hooks/useFetch";

import { isAdAnalyticsReady } from "../../constants/shared/growthPlatformConfig";
import {
  buildCampaignRows,
  buildCampaignStatCards,
  buildSpendTrend,
  spendTrendChartTitle,
} from "../../utils/campaigns/campaignMetrics";
import { filterCampaignMetricsByRange } from "../../utils/dashboard/dashboardDataFilters";
import { enrichCampaignRowsWithLearning } from "../../utils/learning/enrichCampaignRowsWithLearning";
import { saveGrowthReport } from "../../utils/reports/generateReport";
import { resolveGrowthReportPeriod } from "../../utils/shared/reportPeriod";
import { useGrowthDateRange } from "../shared/useGrowthDateRange";
import { useGrowthSelectedAdAccount } from "../shared/useGrowthSelectedAdAccount";

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
  const analyticsReady = isAdAnalyticsReady(adsPlatform);

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

  const loadBenchmarks = useCallback(
    () =>
      adAccountId && analyticsReady
        ? fetchActiveBenchmarksForAccount(adAccountId)
        : Promise.resolve([]),
    [adAccountId, analyticsReady],
  );
  const { data: benchmarks } = useFetch(loadBenchmarks, []);

  const filteredMetrics = useMemo(
    () => filterCampaignMetricsByRange(metrics, range),
    [metrics, range],
  );

  const statCards = useMemo(
    () =>
      analyticsReady
        ? buildCampaignStatCards(filteredMetrics, currencyCode, adsPlatform)
        : [],
    [analyticsReady, filteredMetrics, currencyCode, adsPlatform],
  );
  const spendTrend = useMemo(
    () =>
      analyticsReady
        ? buildSpendTrend(filteredMetrics)
        : { points: [], granularity: "day" as const },
    [analyticsReady, filteredMetrics],
  );
  const spendTrendTitle = spendTrendChartTitle(spendTrend.granularity);
  const campaignRows = useMemo(() => {
    if (!analyticsReady) return [];
    const base = buildCampaignRows(filteredMetrics);
    return enrichCampaignRowsWithLearning(
      base,
      filteredMetrics,
      benchmarks,
      adsPlatform,
    );
  }, [analyticsReady, filteredMetrics, benchmarks, adsPlatform]);

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
