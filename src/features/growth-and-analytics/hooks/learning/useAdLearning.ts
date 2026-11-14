import { useCallback, useMemo, useState } from "react";

import { fetchAdMetricsByAdId } from "@/services/adMetricsService";
import { fetchAdById } from "@/services/adsService";
import { fetchAdsetById } from "@/services/adsetsService";
import { useFetch } from "@/shared/hooks/useFetch";

import { BENCHMARK_DEFAULT_MIN_RESULTS } from "../../constants/learning/campaignLearning";
import type {
  CampaignKpiConfig,
  CampaignKpiKey,
  CampaignLearningView,
  CampaignMetricRow,
} from "../../types/types";
import { buildCampaignLearningView } from "../../utils/learning/buildCampaignLearningView";
import { defaultKpisForCampaign } from "../../utils/learning/defaultCampaignKpis";
import { mapAdMetricsToCampaignRows } from "../../utils/learning/mapAdMetricsToCampaignRows";
import { useGrowthSelectedAdAccount } from "../shared/useGrowthSelectedAdAccount";

type LearningRaw = {
  dailyRows: CampaignMetricRow[];
  adName: string;
  objective: string | null;
};

const EMPTY: LearningRaw | null = null;

export function useAdLearning(adsetId: string, adId: string) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();
  const [rangeDays, setRangeDays] = useState(7);
  const [chartKpi, setChartKpi] = useState<CampaignKpiKey | null>(null);

  const load = useCallback(async (): Promise<LearningRaw | null> => {
    if (!adId || !accountId) return EMPTY;
    const [metrics, ad, adset] = await Promise.all([
      fetchAdMetricsByAdId(accountId, adId),
      fetchAdById(accountId, adId),
      adsetId ? fetchAdsetById(accountId, adsetId) : Promise.resolve(null),
    ]);
    if (!ad && metrics.length === 0) return EMPTY;
    const objective = adset?.performanceGoal ?? null;
    return {
      dailyRows: mapAdMetricsToCampaignRows(metrics, { objective }),
      adName: ad?.adName ?? metrics[0]?.adName ?? "Ad",
      objective,
    };
  }, [adId, adsetId, accountId]);

  const { data: raw, isLoading, error } = useFetch(load, EMPTY);

  const kpiConfig = useMemo((): CampaignKpiConfig | null => {
    if (!activeAccount || !accountId || !raw) return null;
    const defaults = defaultKpisForCampaign(activeAccount.platform, raw.objective);
    return {
      id: "ad-default",
      adAccountId: accountId,
      campaignId: adId,
      primaryKpi: defaults.primaryKpi,
      primaryDirection: defaults.primaryDirection,
      secondaryKpis: defaults.secondaryKpis,
      minResults: BENCHMARK_DEFAULT_MIN_RESULTS,
      qualifiedCallSeconds: 60,
      lastGoalChangeAt: null,
    };
  }, [activeAccount, accountId, raw, adId]);

  const view = useMemo((): CampaignLearningView | null => {
    if (!raw || !kpiConfig || !activeAccount) return null;
    return buildCampaignLearningView({
      campaignId: adId,
      campaignName: raw.adName,
      status: "Active",
      objective: raw.objective,
      account: activeAccount,
      dailyRows: raw.dailyRows,
      kpiConfig,
      benchmark: null,
      pendingBenchmark: null,
      rangeDays,
      chartKpi: chartKpi ?? kpiConfig.primaryKpi,
    });
  }, [raw, kpiConfig, activeAccount, adId, rangeDays, chartKpi]);

  return {
    view,
    isLoading,
    error,
    rangeDays,
    setRangeDays,
    chartKpi: chartKpi ?? kpiConfig?.primaryKpi ?? "cost_per_result",
    setChartKpi,
  };
}
