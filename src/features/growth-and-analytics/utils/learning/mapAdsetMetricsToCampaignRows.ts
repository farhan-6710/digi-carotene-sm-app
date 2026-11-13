import type {
  AdsetMetricRow,
  CampaignMetricRow,
  CampaignRow,
} from "../../types/types";

/** Adapt thin adset daily metrics into CampaignMetricRow for shared Learning utils. */
export function mapAdsetMetricsToCampaignRows(
  rows: AdsetMetricRow[],
  opts: {
    status?: CampaignRow["status"];
    objective?: string | null;
  } = {},
): CampaignMetricRow[] {
  const status = opts.status ?? "Active";
  const objective = opts.objective ?? null;

  return rows.map((row) => ({
    campaignId: row.adsetId,
    campaignName: row.adsetName,
    status,
    objective,
    spend: row.spend,
    impressions: row.impressions,
    reach: row.reach,
    clicks: row.clicks,
    cpm: row.cpm,
    frequency: row.frequency,
    conversions: row.conversions,
    conversionValue: 0,
    searchImpressionShare: null,
    searchBudgetLostImpressionShare: null,
    searchRankLostImpressionShare: null,
    activeViewViewability: null,
    videoViews: 0,
    averageCpv: null,
    videoQuartileP25Rate: null,
    videoQuartileP50Rate: null,
    videoQuartileP75Rate: null,
    videoQuartileP100Rate: null,
    localShopVisits: 0,
    localWebsiteVisits: 0,
    localDirectionViews: 0,
    localCalls: 0,
    localOrders: 0,
    localMenuViews: 0,
    localOtherActions: 0,
    date: row.date,
  }));
}
