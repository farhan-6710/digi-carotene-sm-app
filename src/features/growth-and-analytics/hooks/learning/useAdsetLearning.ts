import { useCallback, useMemo, useState } from "react";

import { fetchAdsetById } from "@/services/adsetsService";
import { fetchAdsetMetricsByAdsetId } from "@/services/adsetMetricsService";
import {
  approveAdsetBenchmark,
  dismissAdsetNewBestFlag,
  fetchActiveAdsetBenchmark,
  fetchAdsetKpiConfig,
  fetchPendingAdsetBenchmark,
  rejectAdsetBenchmark,
  saveAdsetBenchmark,
  upsertAdsetKpiConfig,
} from "@/services/adsetLearningService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFetch } from "@/shared/hooks/useFetch";
import { isAdminOrManagerRole } from "@/shared/utils/rbac";
import { showToast } from "@/shared/utils/showToast";
import {
  EXECUTIVE_BENCHMARK_NEEDS_APPROVAL,
  LEARNING_NEW_BEST_DISMISS_DAYS,
} from "../../constants/learning/campaignLearning";
import type {
  CampaignKpiKey,
  CampaignLearningView,
  CampaignMetricRow,
  SaveAdsetBenchmarkInput,
} from "../../types/types";
import { buildCampaignLearningView } from "../../utils/learning/buildCampaignLearningView";
import { defaultKpisForCampaign } from "../../utils/learning/defaultCampaignKpis";
import { mapAdsetMetricsToCampaignRows } from "../../utils/learning/mapAdsetMetricsToCampaignRows";
import { useGrowthSelectedAdAccount } from "../shared/useGrowthSelectedAdAccount";

type LearningRaw = {
  dailyRows: CampaignMetricRow[];
  adsetName: string;
  objective: string | null;
};

const EMPTY: LearningRaw | null = null;

export function useAdsetLearning(campaignId: string, adsetId: string) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();
  const { teamRole, user } = useAuth();
  const [rangeDays, setRangeDays] = useState(7);
  const [chartKpi, setChartKpi] = useState<CampaignKpiKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const load = useCallback(async (): Promise<LearningRaw | null> => {
    if (!adsetId || !accountId) return EMPTY;
    const [metrics, adset] = await Promise.all([
      fetchAdsetMetricsByAdsetId(accountId, adsetId),
      fetchAdsetById(accountId, adsetId),
    ]);
    if (metrics.length === 0 && !adset) return EMPTY;
    const objective = adset?.performanceGoal ?? null;
    const dailyRows = mapAdsetMetricsToCampaignRows(metrics, { objective });
    const adsetName =
      adset?.adsetName ?? metrics[0]?.adsetName ?? "Ad set";
    if (dailyRows.length === 0) {
      return { dailyRows: [], adsetName, objective };
    }
    return { dailyRows, adsetName, objective };
  }, [adsetId, accountId]);

  const loadConfig = useCallback(async () => {
    if (!adsetId || !campaignId || !accountId || !activeAccount) return null;
    const existing = await fetchAdsetKpiConfig(accountId, adsetId);
    if (existing) return existing;

    const adset = await fetchAdsetById(accountId, adsetId);
    const defaults = defaultKpisForCampaign(
      activeAccount.platform,
      adset?.performanceGoal ?? null,
    );
    return upsertAdsetKpiConfig({
      adAccountId: accountId,
      campaignId,
      adsetId,
      ...defaults,
    });
  }, [adsetId, campaignId, accountId, activeAccount]);

  const loadBenchmark = useCallback(async () => {
    if (!adsetId || !accountId) {
      return { active: null, pending: null };
    }
    const [active, pending] = await Promise.all([
      fetchActiveAdsetBenchmark(accountId, adsetId),
      fetchPendingAdsetBenchmark(accountId, adsetId),
    ]);
    return { active, pending };
  }, [adsetId, accountId]);

  const {
    data: raw,
    isLoading: isRawLoading,
    error: rawError,
    reload: reloadRaw,
  } = useFetch(load, EMPTY);
  const {
    data: kpiConfig,
    isLoading: isConfigLoading,
    reload: reloadConfig,
  } = useFetch(loadConfig, null);
  const {
    data: benchmarks,
    isLoading: isBenchLoading,
    reload: reloadBenchmarks,
  } = useFetch(loadBenchmark, { active: null, pending: null });

  const reload = useCallback(() => {
    reloadRaw();
    reloadConfig();
    reloadBenchmarks();
  }, [reloadRaw, reloadConfig, reloadBenchmarks]);

  const view = useMemo((): CampaignLearningView | null => {
    if (!raw || !kpiConfig || !activeAccount) return null;
    if (raw.dailyRows.length === 0) return null;
    const resolvedChartKpi = chartKpi ?? kpiConfig.primaryKpi;
    return buildCampaignLearningView({
      campaignId: adsetId,
      campaignName: raw.adsetName,
      status: "Active",
      objective: raw.objective,
      account: activeAccount,
      dailyRows: raw.dailyRows,
      kpiConfig,
      benchmark: benchmarks.active,
      pendingBenchmark: benchmarks.pending,
      rangeDays,
      chartKpi: resolvedChartKpi,
    });
  }, [
    raw,
    kpiConfig,
    activeAccount,
    adsetId,
    benchmarks,
    rangeDays,
    chartKpi,
  ]);

  const canApprove = isAdminOrManagerRole(teamRole);
  const requireApproval =
    EXECUTIVE_BENCHMARK_NEEDS_APPROVAL && !isAdminOrManagerRole(teamRole);

  const saveBenchmark = async (
    input: Omit<
      SaveAdsetBenchmarkInput,
      | "adAccountId"
      | "campaignId"
      | "adsetId"
      | "platform"
      | "currency"
      | "requireApproval"
      | "createdBy"
    >,
  ) => {
    if (!activeAccount || !accountId) return;
    try {
      await saveAdsetBenchmark({
        ...input,
        adAccountId: accountId,
        campaignId,
        adsetId,
        platform: activeAccount.platform,
        currency: activeAccount.currencyCode,
        requireApproval,
        createdBy: user?.id ?? null,
      });
      showToast(
        "success",
        requireApproval
          ? "Benchmark submitted for approval."
          : "Benchmark saved.",
      );
      setDrawerOpen(false);
      reload();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to save benchmark.",
      );
    }
  };

  const approvePending = async () => {
    if (!benchmarks.pending) return;
    try {
      await approveAdsetBenchmark(benchmarks.pending.id, user?.id ?? null);
      showToast("success", "Benchmark approved.");
      reload();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to approve.",
      );
    }
  };

  const rejectPending = async () => {
    if (!benchmarks.pending) return;
    try {
      await rejectAdsetBenchmark(benchmarks.pending.id);
      showToast("info", "Benchmark rejected.");
      reload();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to reject.",
      );
    }
  };

  const dismissNewBest = async () => {
    if (!benchmarks.active) return;
    const until = new Date();
    until.setUTCDate(until.getUTCDate() + LEARNING_NEW_BEST_DISMISS_DAYS);
    try {
      await dismissAdsetNewBestFlag(
        benchmarks.active.id,
        until.toISOString().slice(0, 10),
      );
      showToast("info", "New best dismissed for 14 days.");
      reload();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to dismiss.",
      );
    }
  };

  return {
    view,
    dailyRows: raw?.dailyRows ?? [],
    isLoading: isRawLoading || isConfigLoading || isBenchLoading,
    error: rawError,
    rangeDays,
    setRangeDays,
    chartKpi: chartKpi ?? kpiConfig?.primaryKpi ?? "cost_per_result",
    setChartKpi,
    drawerOpen,
    setDrawerOpen,
    historyOpen,
    setHistoryOpen,
    canApprove,
    requireApproval,
    saveBenchmark,
    approvePending,
    rejectPending,
    dismissNewBest,
    reload,
  };
}
