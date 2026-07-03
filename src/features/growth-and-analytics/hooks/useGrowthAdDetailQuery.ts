import { useCallback } from "react";

import { fetchAdMetricsByAdId, fetchAdNeighborIds } from "@/services/adMetricsService";
import { fetchAdById } from "@/services/adsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { GrowthAdDetailView } from "../types/types";
import { buildGrowthAdDetailView } from "../utils/growthAdsetDetail";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

const EMPTY: GrowthAdDetailView | null = null;

export function useGrowthAdDetailQuery(
  campaignId: string,
  adsetId: string,
  adId: string,
) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<GrowthAdDetailView | null> => {
    if (!campaignId || !adsetId || !adId || !accountId || !activeAccount) return EMPTY;

    const [ad, dailyRows, neighbors] = await Promise.all([
      fetchAdById(accountId, adId),
      fetchAdMetricsByAdId(accountId, adId),
      fetchAdNeighborIds(accountId, adsetId, adId),
    ]);

    if (!ad) return EMPTY;

    return buildGrowthAdDetailView(ad, dailyRows, activeAccount, neighbors);
  }, [campaignId, adsetId, adId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  return {
    view: data,
    isLoading,
    error,
    reload,
  };
}
