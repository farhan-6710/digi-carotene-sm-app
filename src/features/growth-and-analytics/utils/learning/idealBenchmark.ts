import {
  IDEAL_BENCHMARK_DENSE_SHARE,
  IDEAL_BENCHMARK_LOOKBACK_DAYS,
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

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

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

function rowsInLookback(rows: CampaignMetricRow[]): CampaignMetricRow[] {
  const today = new Date().toISOString().slice(0, 10);
  const from = addDays(today, -(IDEAL_BENCHMARK_LOOKBACK_DAYS - 1));
  return rows.filter((row) => {
    const date = row.date.slice(0, 10);
    return date >= from && date <= today;
  });
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
 * Default targets from the last 30 days.
 * Uses the densest half of daily values, then nudges slightly toward better.
 * Frequency keeps the band itself (too low is not better).
 */
export function idealBenchmarkValues(
  dailyRows: CampaignMetricRow[],
  keys: CampaignKpiKey[],
): BenchmarkValues {
  const recent = rowsInLookback(dailyRows);
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
