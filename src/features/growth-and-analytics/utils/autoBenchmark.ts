import {
  BENCHMARK_DEFAULT_LOOKBACK_DAYS,
  BENCHMARK_DEFAULT_METHOD,
  BENCHMARK_DEFAULT_MIN_RESULTS,
  BENCHMARK_DEFAULT_WINDOW_DAYS,
} from "../constants/campaignLearning";
import type {
  AutoBenchmarkPreview,
  BenchmarkMethod,
  CampaignKpiKey,
  CampaignMetricRow,
  DateWindow,
  KpiDirection,
} from "../types/types";
import { kpisFromMetricRows, totalResults, totalSpend } from "./kpiFromMetrics";

export type AutoBenchmarkConfig = {
  windowDays?: number;
  lookbackDays?: number;
  minResults?: number;
  method?: BenchmarkMethod;
  primaryKpi: CampaignKpiKey;
  primaryDirection: KpiDirection;
  lastGoalChangeAt?: string | null;
  /** Optional ISO dates that are platform-learning (excluded if overlap > 2 days). */
  learningDates?: Set<string>;
};

type WindowCandidate = {
  start: string;
  end: string;
  rows: CampaignMetricRow[];
  results: number;
  spend: number;
  primaryValue: number;
};

function toDateOnly(isoOrDate: string): string {
  return isoOrDate.slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

function learningOverlapDays(
  start: string,
  end: string,
  learningDates: Set<string>,
): number {
  if (learningDates.size === 0) return 0;
  let count = 0;
  let cursor = start;
  while (cursor <= end) {
    if (learningDates.has(cursor)) count += 1;
    cursor = addDays(cursor, 1);
  }
  return count;
}

function isBetter(
  a: number,
  b: number,
  direction: KpiDirection,
): boolean {
  return direction === "lower" ? a < b : a > b;
}

function pickNonOverlapping(
  sorted: WindowCandidate[],
  count: number,
): WindowCandidate[] {
  const picked: WindowCandidate[] = [];
  for (const candidate of sorted) {
    if (picked.length >= count) break;
    const overlaps = picked.some(
      (p) => candidate.start <= p.end && candidate.end >= p.start,
    );
    if (!overlaps) picked.push(candidate);
  }
  return picked;
}

function percentileWindow(
  sortedBestFirst: WindowCandidate[],
  p: number,
): WindowCandidate | null {
  if (sortedBestFirst.length === 0) return null;
  const index = Math.min(
    sortedBestFirst.length - 1,
    Math.max(0, Math.floor((1 - p) * (sortedBestFirst.length - 1))),
  );
  return sortedBestFirst[index] ?? null;
}

/**
 * Auto benchmark from daily metrics (PDF §7.2).
 * Uses complete days only, ending no later than 3 days ago.
 */
export function computeAutoBenchmark(
  dailyRows: CampaignMetricRow[],
  cfg: AutoBenchmarkConfig,
): AutoBenchmarkPreview {
  const windowDays = cfg.windowDays ?? BENCHMARK_DEFAULT_WINDOW_DAYS;
  const lookbackDays = cfg.lookbackDays ?? BENCHMARK_DEFAULT_LOOKBACK_DAYS;
  const minResults = cfg.minResults ?? BENCHMARK_DEFAULT_MIN_RESULTS;
  const method = cfg.method ?? BENCHMARK_DEFAULT_METHOD;
  const learningDates = cfg.learningDates ?? new Set<string>();
  const excluded: Record<string, number> = {
    learning: 0,
    low_volume: 0,
    low_spend: 0,
    tracking: 0,
    before_goal_change: 0,
  };

  const byDate = new Map<string, CampaignMetricRow>();
  for (const row of dailyRows) {
    byDate.set(toDateOnly(row.date), row);
  }

  const today = new Date().toISOString().slice(0, 10);
  const latestAllowed = addDays(today, -3);
  const lookbackStart = addDays(latestAllowed, -(lookbackDays - 1));

  const dates: string[] = [];
  let cursor = lookbackStart;
  while (cursor <= latestAllowed) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const completeDays = dates
    .map((d) => byDate.get(d))
    .filter((row): row is CampaignMetricRow => Boolean(row));

  const windowSpendSamples: number[] = [];
  for (let i = 0; i + windowDays - 1 < completeDays.length; i += 1) {
    const slice = completeDays.slice(i, i + windowDays);
    if (slice.length === windowDays) {
      windowSpendSamples.push(totalSpend(slice));
    }
  }
  const medianSpend = median(windowSpendSamples);

  const dailyClicks = completeDays.map((r) => r.clicks);
  const medianClicks = median(dailyClicks);

  const candidates: WindowCandidate[] = [];
  const goalChange = cfg.lastGoalChangeAt
    ? toDateOnly(cfg.lastGoalChangeAt)
    : null;

  for (let i = 0; i + windowDays - 1 < dates.length; i += 1) {
    const start = dates[i]!;
    const end = dates[i + windowDays - 1]!;
    const rows: CampaignMetricRow[] = [];
    let missing = false;
    for (let j = 0; j < windowDays; j += 1) {
      const row = byDate.get(dates[i + j]!);
      if (!row) {
        missing = true;
        break;
      }
      rows.push(row);
    }
    if (missing) continue;

    if (goalChange && start <= goalChange) {
      excluded.before_goal_change += 1;
      continue;
    }

    if (learningOverlapDays(start, end, learningDates) > 2) {
      excluded.learning += 1;
      continue;
    }

    const results = totalResults(rows);
    if (results < minResults) {
      excluded.low_volume += 1;
      continue;
    }

    const spend = totalSpend(rows);
    if (medianSpend > 0 && spend < 0.5 * medianSpend) {
      excluded.low_spend += 1;
      continue;
    }

    const hasTrackingIssue = rows.some(
      (row) =>
        row.conversions === 0 &&
        medianClicks > 0 &&
        row.clicks >= 3 * medianClicks,
    );
    if (hasTrackingIssue) {
      excluded.tracking += 1;
      continue;
    }

    const kpis = kpisFromMetricRows(rows);
    const primaryValue = kpis[cfg.primaryKpi];
    if (primaryValue === undefined || Number.isNaN(primaryValue)) continue;

    candidates.push({
      start,
      end,
      rows,
      results,
      spend,
      primaryValue,
    });
  }

  if (candidates.length === 0) {
    return {
      status: "insufficient_data",
      values: {},
      windows: [],
      eligible: 0,
      excluded,
      method,
    };
  }

  const sorted = [...candidates].sort((a, b) =>
    isBetter(a.primaryValue, b.primaryValue, cfg.primaryDirection) ? -1 : 1,
  );

  let picked: WindowCandidate[] = [];
  if (method === "p80") {
    const one = percentileWindow(sorted, 0.8);
    if (one) picked = [one];
  } else {
    picked = pickNonOverlapping(sorted, method === "top3" ? 3 : 1);
  }

  if (picked.length === 0) {
    return {
      status: "insufficient_data",
      values: {},
      windows: [],
      eligible: candidates.length,
      excluded,
      method,
    };
  }

  const combinedRows = picked.flatMap((w) => w.rows);
  const values = kpisFromMetricRows(combinedRows);
  const windows: DateWindow[] = picked.map((w) => ({
    start: w.start,
    end: w.end,
  }));

  return {
    status: "ok",
    values,
    windows,
    eligible: candidates.length,
    excluded,
    method,
  };
}

export function countDaysOfData(dailyRows: CampaignMetricRow[]): number {
  const dates = new Set(dailyRows.map((r) => toDateOnly(r.date)));
  return dates.size;
}

export function windowsOverlapDays(a: DateWindow, b: DateWindow): number {
  const start = a.start > b.start ? a.start : b.start;
  const end = a.end < b.end ? a.end : b.end;
  if (start > end) return 0;
  return daysBetween(start, end) + 1;
}
