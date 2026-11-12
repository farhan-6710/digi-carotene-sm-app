import {
  LEARNING_MIN_HISTORY_DAYS,
  LEARNING_NEW_BEST_DAYS,
  LEARNING_NEW_BEST_GAP,
} from "../../constants/learning/campaignLearning";
import type {
  CampaignBenchmark,
  CampaignKpiKey,
  CampaignMetricRow,
  KpiDirection,
  LearningModeView,
} from "../../types/types";
import { countDaysOfData } from "./autoBenchmark";
import { computeGap } from "./gapStatus";
import { kpisFromMetricRows, totalResults } from "./kpiFromMetrics";

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function lastNCompleteDays(
  dailyRows: CampaignMetricRow[],
  n: number,
): CampaignMetricRow[] {
  const today = new Date().toISOString().slice(0, 10);
  const latestAllowed = addDays(today, -1);
  const byDate = new Map(dailyRows.map((r) => [r.date.slice(0, 10), r]));
  const rows: CampaignMetricRow[] = [];
  let cursor = latestAllowed;
  while (rows.length < n) {
    const row = byDate.get(cursor);
    if (row) rows.push(row);
    cursor = addDays(cursor, -1);
    if (cursor < "2000-01-01") break;
  }
  return rows;
}

export function resolveLearningMode(input: {
  dailyRows: CampaignMetricRow[];
  activeBenchmark: CampaignBenchmark | null;
  primaryKpi: CampaignKpiKey;
  primaryDirection: KpiDirection;
  minResults: number;
  inPlatformLearning?: boolean;
}): LearningModeView {
  const daysOfData = countDaysOfData(input.dailyRows);
  const resultsInLookback = totalResults(input.dailyRows);
  const hasBenchmark = Boolean(input.activeBenchmark);

  if (!hasBenchmark && daysOfData < LEARNING_MIN_HISTORY_DAYS) {
    return {
      state: "collecting",
      newBest: false,
      daysOfData,
      resultsInLookback,
    };
  }

  if (!hasBenchmark) {
    return {
      state: "collecting",
      newBest: false,
      daysOfData,
      resultsInLookback,
    };
  }

  const newBest = detectNewBest({
    dailyRows: input.dailyRows,
    benchmark: input.activeBenchmark!,
    primaryKpi: input.primaryKpi,
    primaryDirection: input.primaryDirection,
    minResults: input.minResults,
    inPlatformLearning: input.inPlatformLearning ?? false,
  });

  return {
    state: "tracking",
    newBest,
    daysOfData,
    resultsInLookback,
  };
}

export function detectNewBest(input: {
  dailyRows: CampaignMetricRow[];
  benchmark: CampaignBenchmark;
  primaryKpi: CampaignKpiKey;
  primaryDirection: KpiDirection;
  minResults: number;
  inPlatformLearning: boolean;
}): boolean {
  if (input.inPlatformLearning) return false;
  if (input.benchmark.newBestDismissedUntil) {
    const today = new Date().toISOString().slice(0, 10);
    if (today <= input.benchmark.newBestDismissedUntil) return false;
  }

  const recent = lastNCompleteDays(input.dailyRows, LEARNING_NEW_BEST_DAYS);
  if (recent.length < LEARNING_NEW_BEST_DAYS) return false;
  if (totalResults(recent) < input.minResults) return false;

  const benchmarkValue = input.benchmark.values[input.primaryKpi];
  if (benchmarkValue === undefined) return false;

  const current = kpisFromMetricRows(recent)[input.primaryKpi];
  if (current === undefined) return false;

  const gap = computeGap(current, benchmarkValue, input.primaryDirection);
  return gap !== null && gap >= LEARNING_NEW_BEST_GAP;
}
