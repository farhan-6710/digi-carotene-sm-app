import type {
  Ad,
  AdMetricRow,
  AdRow,
  Adset,
  AdsetMetricRow,
  AdsetRow,
} from "../types/types";

type MetricTotals = {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  cpm: number;
  frequency: number;
  conversions: number;
  cpmWeighted: number;
  freqWeighted: number;
};

function emptyTotals(): MetricTotals {
  return {
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    cpm: 0,
    frequency: 0,
    conversions: 0,
    cpmWeighted: 0,
    freqWeighted: 0,
  };
}

function addMetricRow(totals: MetricTotals, row: AdsetMetricRow | AdMetricRow): void {
  totals.spend += row.spend;
  totals.impressions += row.impressions;
  totals.reach += row.reach;
  totals.clicks += row.clicks;
  totals.conversions += row.conversions;
  totals.cpmWeighted += row.cpm * row.impressions;
  totals.freqWeighted += row.frequency * row.impressions;
}

function finalizeTotals(totals: MetricTotals) {
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

export function buildAdsetRows(
  adsets: Adset[],
  metricRows: AdsetMetricRow[],
): AdsetRow[] {
  const nameById = new Map(adsets.map((adset) => [adset.adsetId, adset.adsetName]));
  const byAdset = new Map<string, MetricTotals>();

  for (const row of metricRows) {
    const current = byAdset.get(row.adsetId) ?? emptyTotals();
    addMetricRow(current, row);
    byAdset.set(row.adsetId, current);
    if (!nameById.has(row.adsetId)) {
      nameById.set(row.adsetId, row.adsetName);
    }
  }

  return [...byAdset.entries()]
    .map(([adsetId, totals]) => {
      const finalized = finalizeTotals(totals);
      return {
        id: adsetId,
        name: nameById.get(adsetId) ?? "Unnamed ad set",
        spend: finalized.spend,
        impressions: finalized.impressions,
        reach: finalized.reach,
        clicks: finalized.clicks,
        ctr: finalized.ctr,
        cpm: finalized.cpm,
        frequency: finalized.frequency,
        conversions: finalized.conversions,
      };
    })
    .sort((a, b) => b.spend - a.spend);
}

export function buildAdRows(ads: Ad[], metricRows: AdMetricRow[]): AdRow[] {
  const nameById = new Map(ads.map((ad) => [ad.adId, ad.adName]));
  const byAd = new Map<string, MetricTotals>();

  for (const row of metricRows) {
    const current = byAd.get(row.adId) ?? emptyTotals();
    addMetricRow(current, row);
    byAd.set(row.adId, current);
    if (!nameById.has(row.adId)) {
      nameById.set(row.adId, row.adName);
    }
  }

  return [...byAd.entries()]
    .map(([adId, totals]) => {
      const finalized = finalizeTotals(totals);
      return {
        id: adId,
        name: nameById.get(adId) ?? "Unnamed ad",
        spend: finalized.spend,
        impressions: finalized.impressions,
        reach: finalized.reach,
        clicks: finalized.clicks,
        ctr: finalized.ctr,
        cpm: finalized.cpm,
        frequency: finalized.frequency,
        conversions: finalized.conversions,
      };
    })
    .sort((a, b) => b.spend - a.spend);
}
