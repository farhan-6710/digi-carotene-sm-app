import { useCallback, useMemo } from "react";

import { fetchAdMetricsByAdId, fetchAdNeighborIds } from "@/services/adMetricsService";
import { fetchAdById } from "@/services/adsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { Ad, AdAccount, AdMetricRow, GrowthAdDetailView } from "../types/types";
import { filterAdMetricsByRange } from "../utils/dashboardDataFilters";
import { buildGrowthAdDetailView } from "../utils/growthAdsetDetail";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

type AdDetailRaw = {
  ad: Ad;
  dailyRows: AdMetricRow[];
  account: AdAccount;
  neighbors: { previousAdId: string | null; nextAdId: string | null };
};

const EMPTY: AdDetailRaw | null = null;

export function useGrowthAdDetailQuery(
  campaignId: string,
  adsetId: string,
  adId: string,
) {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<AdDetailRaw | null> => {
    if (!campaignId || !adsetId || !adId || !accountId || !activeAccount) return EMPTY;

    const [ad, dailyRows, neighbors] = await Promise.all([
      fetchAdById(accountId, adId),
      fetchAdMetricsByAdId(accountId, adId),
      fetchAdNeighborIds(accountId, adsetId, adId),
    ]);

    if (!ad) return EMPTY;

    return {
      ad,
      dailyRows,
      account: activeAccount,
      neighbors,
    };
  }, [campaignId, adsetId, adId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  const view = useMemo((): GrowthAdDetailView | null => {
    if (!data) return null;

    const filteredDaily = filterAdMetricsByRange(data.dailyRows, range);

    return buildGrowthAdDetailView(
      data.ad,
      filteredDaily,
      data.account,
      data.neighbors,
    );
  }, [data, range]);

  return {
    view,
    isLoading,
    error,
    reload,
    dateFilterProps,
    periodLabel,
    range,
  };
}
