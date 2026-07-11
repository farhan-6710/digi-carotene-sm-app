import { useCallback, useMemo } from "react";

import {
  fetchAdCampaignMetricsByCampaignId,
  fetchAdCampaignNeighborIds,
} from "@/services/adCampaignMetricsService";
import { fetchAdsetMetricsByCampaign } from "@/services/adsetMetricsService";
import { fetchAdsetsByCampaign } from "@/services/adsetsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type {
  AdAccount,
  Adset,
  AdsetMetricRow,
  CampaignMetricRow,
  GrowthCampaignDetailView,
} from "../types/types";
import {
  filterAdsetMetricsByRange,
  filterCampaignMetricsByRange,
} from "../utils/dashboardDataFilters";
import { buildGrowthCampaignDetailView } from "../utils/growthCampaignDetail";
import { useGrowthDateRange } from "./useGrowthDateRange";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

type CampaignDetailRaw = {
  dailyRows: CampaignMetricRow[];
  adsets: Adset[];
  adsetMetricRows: AdsetMetricRow[];
  account: AdAccount;
  neighbors: { previousCampaignId: string | null; nextCampaignId: string | null };
};

const EMPTY: CampaignDetailRaw | null = null;

export function useGrowthCampaignDetailQuery(campaignId: string) {
  const { range, dateFilterProps, periodLabel } = useGrowthDateRange();
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<CampaignDetailRaw | null> => {
    if (!campaignId || !accountId || !activeAccount) return EMPTY;

    const [dailyRows, adsets, adsetMetricRows, neighbors] = await Promise.all([
      fetchAdCampaignMetricsByCampaignId(accountId, campaignId),
      fetchAdsetsByCampaign(accountId, campaignId),
      fetchAdsetMetricsByCampaign(accountId, campaignId),
      fetchAdCampaignNeighborIds(accountId, campaignId),
    ]);

    if (dailyRows.length === 0 && adsetMetricRows.length === 0) return EMPTY;

    return {
      dailyRows,
      adsets,
      adsetMetricRows,
      account: activeAccount,
      neighbors,
    };
  }, [campaignId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  const view = useMemo((): GrowthCampaignDetailView | null => {
    if (!data) return null;

    const filteredDaily = filterCampaignMetricsByRange(data.dailyRows, range);
    const filteredAdset = filterAdsetMetricsByRange(data.adsetMetricRows, range);

    return buildGrowthCampaignDetailView(
      filteredDaily,
      data.adsets,
      filteredAdset,
      data.account,
      data.neighbors,
      {
        dailyRows: data.dailyRows,
        adsetMetricRows: data.adsetMetricRows,
      },
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
