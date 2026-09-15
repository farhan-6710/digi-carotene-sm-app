import type { AdAccount, Adset, AdsetMetricRow, CampaignMetricRow, GrowthCampaignDetailView } from "../types/types";
import { buildAdsetRows } from "./adHierarchyMetrics";

type CampaignDetailMetadata = {
  dailyRows: CampaignMetricRow[];
  adsetMetricRows: AdsetMetricRow[];
};

function averageNullable(
  rows: CampaignMetricRow[],
  get: (row: CampaignMetricRow) => number | null,
): number | null {
  const values = rows
    .map(get)
    .filter((value): value is number => value !== null && !Number.isNaN(value));
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildGrowthCampaignDetailView(
  dailyRows: CampaignMetricRow[],
  adsets: Adset[],
  adsetMetricRows: AdsetMetricRow[],
  account: AdAccount,
  neighbors: { previousCampaignId: string | null; nextCampaignId: string | null },
  metadata?: CampaignDetailMetadata,
): GrowthCampaignDetailView {
  const metaDaily = metadata?.dailyRows ?? dailyRows;
  const metaAdset = metadata?.adsetMetricRows ?? adsetMetricRows;
  const latestRow = metaDaily[0];
  const spend = dailyRows.reduce((sum, row) => sum + row.spend, 0);
  const impressions = dailyRows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = dailyRows.reduce((sum, row) => sum + row.clicks, 0);
  const conversions = dailyRows.reduce((sum, row) => sum + row.conversions, 0);
  const conversionValue = dailyRows.reduce(
    (sum, row) => sum + row.conversionValue,
    0,
  );
  const videoViews = dailyRows.reduce((sum, row) => sum + row.videoViews, 0);

  const campaignId =
    latestRow?.campaignId ??
    metaAdset[0]?.campaignId ??
    adsetMetricRows[0]?.campaignId ??
    "";
  const campaignName = latestRow?.campaignName ?? "Campaign";
  const status = latestRow?.status ?? "Completed";
  const objective = latestRow?.objective ?? null;

  return {
    campaignId,
    campaignName,
    status,
    objective,
    adAccountName: account.accountName,
    currencyCode: account.currencyCode,
    spend,
    impressions,
    clicks,
    conversions,
    conversionValue,
    ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    searchImpressionShare: averageNullable(
      dailyRows,
      (row) => row.searchImpressionShare,
    ),
    searchBudgetLostImpressionShare: averageNullable(
      dailyRows,
      (row) => row.searchBudgetLostImpressionShare,
    ),
    searchRankLostImpressionShare: averageNullable(
      dailyRows,
      (row) => row.searchRankLostImpressionShare,
    ),
    activeViewViewability: averageNullable(
      dailyRows,
      (row) => row.activeViewViewability,
    ),
    videoViews,
    averageCpv: averageNullable(dailyRows, (row) => row.averageCpv),
    videoQuartileP25Rate: averageNullable(
      dailyRows,
      (row) => row.videoQuartileP25Rate,
    ),
    videoQuartileP50Rate: averageNullable(
      dailyRows,
      (row) => row.videoQuartileP50Rate,
    ),
    videoQuartileP75Rate: averageNullable(
      dailyRows,
      (row) => row.videoQuartileP75Rate,
    ),
    videoQuartileP100Rate: averageNullable(
      dailyRows,
      (row) => row.videoQuartileP100Rate,
    ),
    cpm: impressions > 0 ? Number(((spend / impressions) * 1000).toFixed(2)) : 0,
    dailyRows,
    adsetRows: buildAdsetRows(adsets, adsetMetricRows),
    previousCampaignId: neighbors.previousCampaignId,
    nextCampaignId: neighbors.nextCampaignId,
  };
}
