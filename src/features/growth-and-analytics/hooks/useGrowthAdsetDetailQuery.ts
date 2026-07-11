import { useCallback, useMemo } from "react";

import { fetchAdMetricsByAdset } from "@/services/adMetricsService";
import { fetchAdsByAdset } from "@/services/adsService";
import {
  fetchAdsetMetricsByAdsetId,
  fetchAdsetNeighborIds,
} from "@/services/adsetMetricsService";
import { fetchAdsetById } from "@/services/adsetsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type {
  Ad,
  AdAccount,
  AdMetricRow,
  Adset,
  AdsetMetricRow,
  GrowthAdsetDetailView,
} from "../types/types";
import {
  filterAdMetricsByRange,
  filterAdsetMetricsByRange,
} from "../utils/dashboardDataFilters";
import { buildGrowthAdsetDetailView } from "../utils/growthAdsetDetail";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

type AdsetDetailRaw = {
  adset: Adset;
  metricRows: AdsetMetricRow[];
  ads: Ad[];
  adMetricRows: AdMetricRow[];
  account: AdAccount;
  neighbors: { previousAdsetId: string | null; nextAdsetId: string | null };
};

const EMPTY: AdsetDetailRaw | null = null;

export function useGrowthAdsetDetailQuery(campaignId: string, adsetId: string) {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<AdsetDetailRaw | null> => {
    if (!campaignId || !adsetId || !accountId || !activeAccount) return EMPTY;

    const [adset, metricRows, ads, adMetricRows, neighbors] = await Promise.all([
      fetchAdsetById(accountId, adsetId),
      fetchAdsetMetricsByAdsetId(accountId, adsetId),
      fetchAdsByAdset(accountId, adsetId),
      fetchAdMetricsByAdset(accountId, adsetId),
      fetchAdsetNeighborIds(accountId, campaignId, adsetId),
    ]);

    if (!adset) return EMPTY;

    return {
      adset,
      metricRows,
      ads,
      adMetricRows,
      account: activeAccount,
      neighbors,
    };
  }, [campaignId, adsetId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  const view = useMemo((): GrowthAdsetDetailView | null => {
    if (!data) return null;

    const filteredAdsetMetrics = filterAdsetMetricsByRange(data.metricRows, range);
    const filteredAdMetrics = filterAdMetricsByRange(data.adMetricRows, range);

    return buildGrowthAdsetDetailView(
      data.adset,
      filteredAdsetMetrics,
      data.ads,
      filteredAdMetrics,
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
  };
}
