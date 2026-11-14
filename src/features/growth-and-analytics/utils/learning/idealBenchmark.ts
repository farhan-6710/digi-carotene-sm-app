import {
  IDEAL_BENCHMARK_DENSE_SHARE,
  IDEAL_BENCHMARK_MIN_DAYS,
  IDEAL_BENCHMARK_NUDGE,
} from "../../constants/learning/campaignLearning";
import type {
  BenchmarkValues,
  CampaignKpiKey,
  CampaignMetricRow,
  KpiDirection,
} from "../../types/types";
import { kpiDirection } from "./defaultCampaignKpis";
import { kpisFromMetricRows, readKpiValue } from "./kpiFromMetrics";

type DenseBand = { low: number; high: number; center: number };

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

/** Tightest slice that holds half the days — where the line actually sits. */
function shortestHalf(sorted: number[]): DenseBand {
  const count = Math.max(1, Math.ceil(sorted.length * IDEAL_BENCHMARK_DENSE_SHARE));
  let start = 0;
  let bestWidth = Number.POSITIVE_INFINITY;
  const last = sorted.length - count;
  for (let i = 0; i <= last; i += 1) {
    const width = sorted[i + count - 1]! - sorted[i]!;
    if (width < bestWidth) {
      bestWidth = width;
      start = i;
    }
  }
  const slice = sorted.slice(start, start + count);
  return {
    low: slice[0]!,
    high: slice[slice.length - 1]!,
    center: median(slice),
  };
}

/** A little better than the cluster, still inside the band the chart occupies. */
function nudgeTowardBetter(band: DenseBand, direction: KpiDirection): number {
  if (direction === "lower") {
    const nudged = band.center * (1 - IDEAL_BENCHMARK_NUDGE);
    return Math.min(band.center, Math.max(band.low, nudged));
  }
  const nudged = band.center * (1 + IDEAL_BENCHMARK_NUDGE);
  return Math.max(band.center, Math.min(band.high, nudged));
}

function roundIdeal(key: CampaignKpiKey, value: number): number {
  if (
    key === "ctr" ||
    key === "conversion_rate" ||
    key === "search_impression_share"
  ) {
    return Number(value.toFixed(4));
  }
  if (key === "frequency") return Number(value.toFixed(3));
  return Number(value.toFixed(2));
}

/** Every stored day up to today. The 7/14/30 filter must not be applied before this. */
function rowsForBenchmark(rows: CampaignMetricRow[]): CampaignMetricRow[] {
  const today = new Date().toISOString().slice(0, 10);
  return rows.filter((row) => row.date.slice(0, 10) <= today);
}

function dailyValues(rows: CampaignMetricRow[], key: CampaignKpiKey): number[] {
  const values: number[] = [];
  for (const row of rows) {
    const value = readKpiValue(kpisFromMetricRows([row]), key);
    if (value === null || value <= 0) continue;
    values.push(value);
  }
  return values;
}

/**
 * Default targets from all stored days for this campaign, ad set, or ad.
 * Densest half of daily values, then a small nudge toward better.
 * Frequency keeps the band itself (too low is not better).
 */
export function idealBenchmarkValues(
  dailyRows: CampaignMetricRow[],
  keys: CampaignKpiKey[],
): BenchmarkValues {
  const recent = rowsForBenchmark(dailyRows);
  const values: BenchmarkValues = {};

  for (const key of keys) {
    const series = dailyValues(recent, key);
    if (series.length < IDEAL_BENCHMARK_MIN_DAYS) continue;
    const band = shortestHalf([...series].sort((a, b) => a - b));

    if (key === "frequency") {
      values.frequency = roundIdeal(key, band.center);
      if (band.high > band.low) {
        values.frequency_min = roundIdeal(key, band.low);
        values.frequency_max = roundIdeal(key, band.high);
      }
      continue;
    }

    values[key] = roundIdeal(key, nudgeTowardBetter(band, kpiDirection(key)));
  }

  return values;
}
