import type { AdAccount, Adset, AdsetMetricRow, CampaignMetricRow, GrowthCampaignDetailView } from "../types/types";
import { buildAdsetRows } from "./adHierarchyMetrics";

export function buildGrowthCampaignDetailView(
  dailyRows: CampaignMetricRow[],
  adsets: Adset[],
  adsetMetricRows: AdsetMetricRow[],
  account: AdAccount,
  neighbors: { previousCampaignId: string | null; nextCampaignId: string | null },
): GrowthCampaignDetailView {
  const latestRow = dailyRows[0];
  const spend = dailyRows.reduce((sum, row) => sum + row.spend, 0);
  const impressions = dailyRows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = dailyRows.reduce((sum, row) => sum + row.clicks, 0);
  const conversions = dailyRows.reduce((sum, row) => sum + row.conversions, 0);

  const campaignId = latestRow?.campaignId ?? adsetMetricRows[0]?.campaignId ?? "";
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
    ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    dailyRows,
    adsetRows: buildAdsetRows(adsets, adsetMetricRows),
    previousCampaignId: neighbors.previousCampaignId,
    nextCampaignId: neighbors.nextCampaignId,
  };
}
