import type {
  Ad,
  AdAccount,
  AdMetricRow,
  Adset,
  AdsetMetricRow,
  GrowthAdDetailView,
  GrowthAdsetDetailView,
} from "../types/types";
import { buildAdRows } from "./adHierarchyMetrics";

function aggregateMetricTotals<T extends { spend: number; impressions: number; reach: number; clicks: number; conversions: number; cpm: number; frequency: number }>(
  rows: T[],
) {
  const totals = {
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    cpmWeighted: 0,
    freqWeighted: 0,
  };

  for (const row of rows) {
    totals.spend += row.spend;
    totals.impressions += row.impressions;
    totals.reach += row.reach;
    totals.clicks += row.clicks;
    totals.conversions += row.conversions;
    totals.cpmWeighted += row.cpm * row.impressions;
    totals.freqWeighted += row.frequency * row.impressions;
  }

  const cpm = totals.impressions
    ? Number((totals.cpmWeighted / totals.impressions).toFixed(2))
    : 0;
  const frequency = totals.impressions
    ? Number((totals.freqWeighted / totals.impressions).toFixed(2))
    : 0;
  const ctr = totals.impressions
    ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
    : 0;

  return { ...totals, cpm, frequency, ctr };
}

export function buildGrowthAdsetDetailView(
  adset: Adset,
  metricRows: AdsetMetricRow[],
  ads: Ad[],
  adMetricRows: AdMetricRow[],
  account: AdAccount,
  neighbors: { previousAdsetId: string | null; nextAdsetId: string | null },
): GrowthAdsetDetailView {
  const totals = aggregateMetricTotals(metricRows);

  return {
    campaignId: adset.campaignId,
    adsetId: adset.adsetId,
    adsetName: adset.adsetName,
    performanceGoal: adset.performanceGoal,
    locationSummary: adset.locationSummary,
    ageSummary: adset.ageSummary,
    customTargetingSummary: adset.customTargetingSummary,
    detailedTargetingSummary: adset.detailedTargetingSummary,
    placementsSummary: adset.placementsSummary,
    adAccountName: account.accountName,
    currencyCode: account.currencyCode,
    spend: totals.spend,
    impressions: totals.impressions,
    reach: totals.reach,
    clicks: totals.clicks,
    ctr: totals.ctr,
    cpm: totals.cpm,
    frequency: totals.frequency,
    conversions: totals.conversions,
    adRows: buildAdRows(ads, adMetricRows),
    previousAdsetId: neighbors.previousAdsetId,
    nextAdsetId: neighbors.nextAdsetId,
  };
}

export function buildGrowthAdDetailView(
  ad: Ad,
  dailyRows: AdMetricRow[],
  account: AdAccount,
  neighbors: { previousAdId: string | null; nextAdId: string | null },
): GrowthAdDetailView {
  const totals = aggregateMetricTotals(dailyRows);

  return {
    campaignId: ad.campaignId,
    adsetId: ad.adsetId,
    adId: ad.adId,
    adName: ad.adName,
    thumbnailUrl: ad.thumbnailUrl,
    primaryText: ad.primaryText,
    headline: ad.headline,
    adAccountName: account.accountName,
    currencyCode: account.currencyCode,
    spend: totals.spend,
    impressions: totals.impressions,
    reach: totals.reach,
    clicks: totals.clicks,
    ctr: totals.ctr,
    cpm: totals.cpm,
    frequency: totals.frequency,
    conversions: totals.conversions,
    dailyRows,
    previousAdId: neighbors.previousAdId,
    nextAdId: neighbors.nextAdId,
  };
}
