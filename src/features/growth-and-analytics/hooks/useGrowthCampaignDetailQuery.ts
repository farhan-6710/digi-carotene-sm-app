import { useCallback } from "react";

import {
  fetchAdCampaignMetricsByCampaignId,
  fetchAdCampaignNeighborIds,
} from "@/services/adCampaignMetricsService";
import { fetchAdsetMetricsByCampaign } from "@/services/adsetMetricsService";
import { fetchAdsetsByCampaign } from "@/services/adsetsService";
import { useFetch } from "@/shared/hooks/useFetch";

import type { GrowthCampaignDetailView } from "../types/types";
import { buildGrowthCampaignDetailView } from "../utils/growthCampaignDetail";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

const EMPTY: GrowthCampaignDetailView | null = null;

export function useGrowthCampaignDetailQuery(campaignId: string) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const load = useCallback(async (): Promise<GrowthCampaignDetailView | null> => {
    if (!campaignId || !accountId || !activeAccount) return EMPTY;

    const [dailyRows, adsets, adsetMetricRows, neighbors] = await Promise.all([
      fetchAdCampaignMetricsByCampaignId(accountId, campaignId),
      fetchAdsetsByCampaign(accountId, campaignId),
      fetchAdsetMetricsByCampaign(accountId, campaignId),
      fetchAdCampaignNeighborIds(accountId, campaignId),
    ]);

    if (dailyRows.length === 0 && adsetMetricRows.length === 0) return EMPTY;

    return buildGrowthCampaignDetailView(
      dailyRows,
      adsets,
      adsetMetricRows,
      activeAccount,
      neighbors,
    );
  }, [campaignId, accountId, activeAccount]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  return {
    view: data,
    isLoading,
    error,
    reload,
  };
}
