import { useCallback } from "react";

import { fetchAdMetricsByAdset } from "@/services/adMetricsService";
import { fetchAdsByAdset } from "@/services/adsService";
import {
  fetchAdsetMetricsByAdsetId,
  fetchAdsetNeighborIds,
} from "@/services/adsetMetricsService";
import { fetchAdsetById } from "@/services/adsetsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { GrowthAdsetDetailView } from "../types/types";
import { buildGrowthAdsetDetailView } from "../utils/growthAdsetDetail";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

const EMPTY: GrowthAdsetDetailView | null = null;

export function useGrowthAdsetDetailQuery(campaignId: string, adsetId: string) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<GrowthAdsetDetailView | null> => {
    if (!campaignId || !adsetId || !accountId || !activeAccount) return EMPTY;

    const [adset, metricRows, ads, adMetricRows, neighbors] = await Promise.all([
      fetchAdsetById(accountId, adsetId),
      fetchAdsetMetricsByAdsetId(accountId, adsetId),
      fetchAdsByAdset(accountId, adsetId),
      fetchAdMetricsByAdset(accountId, adsetId),
      fetchAdsetNeighborIds(accountId, campaignId, adsetId),
    ]);

    if (!adset) return EMPTY;

    return buildGrowthAdsetDetailView(
      adset,
      metricRows,
      ads,
      adMetricRows,
      activeAccount,
      neighbors,
    );
  }, [campaignId, adsetId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  return {
    view: data,
    isLoading,
    error,
    reload,
  };
}
