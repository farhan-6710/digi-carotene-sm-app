import type {
  BenchmarkValues,
  CampaignKpiKey,
  CampaignMetricRow,
} from "../../types/types";

function sumMetrics(rows: CampaignMetricRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.conversions += row.conversions;
      acc.conversionValue += row.conversionValue;
      acc.frequencySum += row.frequency;
      acc.cpmSum += row.cpm;
      acc.searchIsSum += row.searchImpressionShare ?? 0;
      acc.searchIsCount += row.searchImpressionShare == null ? 0 : 1;
      acc.days += 1;
      return acc;
    },
    {
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      conversionValue: 0,
      frequencySum: 0,
      cpmSum: 0,
      searchIsSum: 0,
      searchIsCount: 0,
      days: 0,
    },
  );
}

/** KPI from window totals — never average of daily ratios (PDF §7.2). */
export function kpisFromMetricRows(rows: CampaignMetricRow[]): BenchmarkValues {
  if (rows.length === 0) return {};
  const t = sumMetrics(rows);
  const values: BenchmarkValues = {};

  values.cost_per_result =
    t.conversions > 0 ? t.spend / t.conversions : undefined;
  values.results_per_day = t.days > 0 ? t.conversions / t.days : undefined;
  values.ctr = t.impressions > 0 ? t.clicks / t.impressions : undefined;
  values.cpm =
    t.impressions > 0 ? (t.spend / t.impressions) * 1000 : t.cpmSum / t.days;
  values.frequency = t.days > 0 ? t.frequencySum / t.days : undefined;
  values.roas = t.spend > 0 ? t.conversionValue / t.spend : undefined;
  values.conversion_rate =
    t.clicks > 0 ? t.conversions / t.clicks : undefined;
  values.search_impression_share =
    t.searchIsCount > 0 ? t.searchIsSum / t.searchIsCount : undefined;

  return values;
}

export function readKpiValue(
  values: BenchmarkValues,
  key: CampaignKpiKey,
): number | null {
  const value = values[key];
  return value === undefined || Number.isNaN(value) ? null : value;
}

export function totalResults(rows: CampaignMetricRow[]): number {
  return rows.reduce((sum, row) => sum + row.conversions, 0);
}

export function totalSpend(rows: CampaignMetricRow[]): number {
  return rows.reduce((sum, row) => sum + row.spend, 0);
}
