import { useCallback, useMemo, useState } from "react";

import { fetchAdCampaignMetricsByCampaignId } from "@/services/adCampaignMetricsService";
import {
  approveCampaignBenchmark,
  dismissNewBestFlag,
  fetchActiveBenchmark,
  fetchCampaignKpiConfig,
  fetchPendingBenchmark,
  rejectCampaignBenchmark,
  saveCampaignBenchmark,
  upsertCampaignKpiConfig,
} from "@/services/campaignLearningService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFetch } from "@/shared/hooks/useFetch";
import { isAdminOrManagerRole } from "@/shared/utils/rbac";
import { showToast } from "@/shared/utils/showToast";
import {
  EXECUTIVE_BENCHMARK_NEEDS_APPROVAL,
  LEARNING_NEW_BEST_DISMISS_DAYS,
} from "../constants/campaignLearning";
import type {
  CampaignKpiKey,
  CampaignLearningView,
  CampaignMetricRow,
  SaveBenchmarkInput,
} from "../types/types";
import { buildCampaignLearningView } from "../utils/buildCampaignLearningView";
import { defaultKpisForCampaign } from "../utils/defaultCampaignKpis";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

type LearningRaw = {
  dailyRows: CampaignMetricRow[];
  campaignName: string;
  status: CampaignMetricRow["status"];
  objective: string | null;
};

const EMPTY: LearningRaw | null = null;

export function useCampaignLearning(campaignId: string) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();
  const { teamRole, user } = useAuth();
  const [rangeDays, setRangeDays] = useState(7);
  const [chartKpi, setChartKpi] = useState<CampaignKpiKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const load = useCallback(async (): Promise<LearningRaw | null> => {
    if (!campaignId || !accountId) return EMPTY;
    const dailyRows = await fetchAdCampaignMetricsByCampaignId(
      accountId,
      campaignId,
    );
    if (dailyRows.length === 0) return EMPTY;
    const latest = dailyRows[0]!;
    return {
      dailyRows,
      campaignName: latest.campaignName,
      status: latest.status,
      objective: latest.objective,
    };
  }, [campaignId, accountId]);

  const loadConfig = useCallback(async () => {
    if (!campaignId || !accountId || !activeAccount) return null;
    const existing = await fetchCampaignKpiConfig(accountId, campaignId);
    if (existing) return existing;

    const rows = await fetchAdCampaignMetricsByCampaignId(accountId, campaignId);
    const objective = rows[0]?.objective ?? null;
    const defaults = defaultKpisForCampaign(activeAccount.platform, objective);
    return upsertCampaignKpiConfig({
      adAccountId: accountId,
      campaignId,
      ...defaults,
    });
  }, [campaignId, accountId, activeAccount]);

  const loadBenchmark = useCallback(async () => {
    if (!campaignId || !accountId) {
      return { active: null, pending: null };
    }
    const [active, pending] = await Promise.all([
      fetchActiveBenchmark(accountId, campaignId),
      fetchPendingBenchmark(accountId, campaignId),
    ]);
    return { active, pending };
  }, [campaignId, accountId]);

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
    const resolvedChartKpi = chartKpi ?? kpiConfig.primaryKpi;
    return buildCampaignLearningView({
      campaignId,
      campaignName: raw.campaignName,
      status: raw.status,
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
    campaignId,
    benchmarks,
    rangeDays,
    chartKpi,
  ]);

  const canApprove = isAdminOrManagerRole(teamRole);
  const requireApproval =
    EXECUTIVE_BENCHMARK_NEEDS_APPROVAL && !isAdminOrManagerRole(teamRole);

  const saveBenchmark = async (
    input: Omit<
      SaveBenchmarkInput,
      "adAccountId" | "campaignId" | "platform" | "currency" | "requireApproval" | "createdBy"
    >,
  ) => {
    if (!activeAccount || !accountId) return;
    try {
      await saveCampaignBenchmark({
        ...input,
        adAccountId: accountId,
        campaignId,
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
      await approveCampaignBenchmark(benchmarks.pending.id, user?.id ?? null);
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
      await rejectCampaignBenchmark(benchmarks.pending.id);
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
      await dismissNewBestFlag(
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
