import { useCallback, useMemo } from "react";

import { fetchAdAccountAccessToken } from "@/services/growthAccountsService";
import {
  fetchAdBreakdownInsights,
  getDefaultSyncRange,
  type AdBreakdownScope,
} from "@/services/metaService";
import { useFetch } from "@/shared/hooks/useFetch";

import type {
  CampaignDemographicTableView,
  DemographicBreakdown,
  GrowthDateRange,
} from "../types/types";
import { CAMPAIGN_BREAKDOWN_META_PARAM } from "../constants/campaignDemographicBreakdown";
import { buildCampaignDemographicTableView } from "../utils/campaignDemographicBreakdown";
import { extractResultActionTypes } from "../utils/metaSyncMappers";
import { useGrowthSelectedAdAccount } from "./useGrowthSelectedAdAccount";

const EMPTY_VIEW: CampaignDemographicTableView = {
  rows: [],
  total: {
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    cpm: 0,
    frequency: 0,
    conversions: 0,
  },
};

// Meta insights need an explicit range; "All time" falls back to the sync window.
function resolveMetaInsightRange(range: GrowthDateRange) {
  if (range.from && range.to) return { from: range.from, to: range.to };
  const fallback = getDefaultSyncRange();
  return { from: fallback.from, to: fallback.to };
}

// Keep a stable order; placement is exclusive so it never mixes with age/gender.
function orderBreakdowns(breakdowns: DemographicBreakdown[]): DemographicBreakdown[] {
  if (breakdowns.includes("placement")) return ["placement"];
  return (["age", "gender"] as const).filter((item) => breakdowns.includes(item));
}

export function useGrowthAdEntityBreakdown(
  scope: AdBreakdownScope,
  range: GrowthDateRange,
  breakdowns: DemographicBreakdown[],
) {
  const { activeAccount, accountId } = useGrowthSelectedAdAccount();

  const metaRange = useMemo(() => resolveMetaInsightRange(range), [range]);
  const ordered = useMemo(() => orderBreakdowns(breakdowns), [breakdowns]);
  const breakdownKey = ordered.join(",");
  const metaBreakdownParam = ordered
    .map((item) => CAMPAIGN_BREAKDOWN_META_PARAM[item])
    .join(",");

  const load = useCallback(async (): Promise<CampaignDemographicTableView> => {
    if (!breakdownKey || !scope.id || !accountId || !activeAccount) {
      return EMPTY_VIEW;
    }

    const accessToken = await fetchAdAccountAccessToken(accountId);
    const isPlacement = breakdownKey === "placement";

    const [primaryInsights, resultInsights] = await Promise.all([
      fetchAdBreakdownInsights(
        activeAccount.adAccountId,
        accessToken,
        metaRange,
        scope,
        metaBreakdownParam,
      ),
      // Placement can't return `results`; fetch scope-level totals separately
      // to learn the true Result action type(s) and reconcile conversions.
      isPlacement
        ? fetchAdBreakdownInsights(
            activeAccount.adAccountId,
            accessToken,
            metaRange,
            scope,
            "",
          )
        : Promise.resolve([]),
    ]);

    const ageSummaryInsights =
      breakdownKey === "age,gender"
        ? await fetchAdBreakdownInsights(
            activeAccount.adAccountId,
            accessToken,
            metaRange,
            scope,
            "age",
          )
        : [];

    const resultActionTypes = isPlacement
      ? extractResultActionTypes(resultInsights)
      : undefined;

    return buildCampaignDemographicTableView(
      ordered,
      primaryInsights,
      ageSummaryInsights,
      resultActionTypes,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, accountId, activeAccount, metaRange, breakdownKey]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY_VIEW);

  return {
    view: data ?? EMPTY_VIEW,
    isLoading: breakdownKey ? isLoading : false,
    error,
    reload,
  };
}

export function useGrowthCampaignDemographicBreakdown(
  campaignId: string,
  range: GrowthDateRange,
  breakdowns: DemographicBreakdown[],
) {
  const scope = useMemo<AdBreakdownScope>(
    () => ({ level: "campaign", id: campaignId }),
    [campaignId],
  );

  return useGrowthAdEntityBreakdown(scope, range, breakdowns);
}
