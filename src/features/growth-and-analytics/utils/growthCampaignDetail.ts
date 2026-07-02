import type { AdAccount, CampaignMetricRow, GrowthCampaignDetailView } from "../types/types";

export function buildGrowthCampaignDetailView(
  dailyRows: CampaignMetricRow[],
  account: AdAccount,
  neighbors: { previousCampaignId: string | null; nextCampaignId: string | null },
): GrowthCampaignDetailView {
  const latestRow = dailyRows[0]!;
  const spend = dailyRows.reduce((sum, row) => sum + row.spend, 0);
  const impressions = dailyRows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = dailyRows.reduce((sum, row) => sum + row.clicks, 0);
  const conversions = dailyRows.reduce((sum, row) => sum + row.conversions, 0);

  return {
    campaignId: latestRow.campaignId,
    campaignName: latestRow.campaignName,
    status: latestRow.status,
    objective: latestRow.objective,
    adAccountName: account.accountName,
    currencyCode: account.currencyCode,
    spend,
    impressions,
    clicks,
    conversions,
    ctr: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    dailyRows,
    previousCampaignId: neighbors.previousCampaignId,
    nextCampaignId: neighbors.nextCampaignId,
  };
}
