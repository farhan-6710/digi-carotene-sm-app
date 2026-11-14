import type {
  AdAccount,
  BenchmarkValues,
  CampaignBenchmark,
  CampaignKpiConfig,
  CampaignKpiKey,
  CampaignLearningView,
  CampaignMetricRow,
  KpiCardView,
} from "../../types/types";
import { kpiDirection, kpiLabel } from "./defaultCampaignKpis";
import { idealBenchmarkValues } from "./idealBenchmark";
import {
  computeFrequencyRangeGap,
  computeGap,
  frequencyRangeMid,
  gapToStatus,
  readFrequencyRange,
} from "./gapStatus";
import { isSyncStale } from "../shared/isSyncStale";
import { kpisFromMetricRows, readKpiValue } from "./kpiFromMetrics";
import { resolveLearningMode } from "./learningMode";

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function latestOnOrBeforeToday(rows: CampaignMetricRow[]): string | null {
  const today = new Date().toISOString().slice(0, 10);
  let latest: string | null = null;
  for (const row of rows) {
    const date = row.date.slice(0, 10);
    if (date > today) continue;
    if (!latest || date > latest) latest = date;
  }
  return latest;
}

/** Last N days ending on this entity's newest stored day, not on today. */
function filterRowsByRange(
  rows: CampaignMetricRow[],
  rangeDays: number,
): { rows: CampaignMetricRow[]; end: string | null } {
  const end = latestOnOrBeforeToday(rows);
  if (!end) return { rows: [], end: null };
  const fromStr = rangeDays > 0 ? addDays(end, -(rangeDays - 1)) : "0000-01-01";
  return {
    end,
    rows: rows.filter((row) => {
      const date = row.date.slice(0, 10);
      return date >= fromStr && date <= end;
    }),
  };
}

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const label = `${Number(day)} ${months[Number(month) - 1] ?? month}`;
  const thisYear = new Date().toISOString().slice(0, 4);
  return year === thisYear ? label : `${label} ${year}`;
}

function rangeNote(end: string | null): string {
  const lead = "Select a KPI card to change the chart.";
  const tail = "The benchmark stays on the full history.";
  if (!end || end >= addDays(new Date().toISOString().slice(0, 10), -1)) {
    return `${lead} The range changes current numbers only. ${tail}`;
  }
  return `${lead} Ranges count back from ${formatDay(end)}, the last day with results. ${tail}`;
}

function sparklineForKpi(
  dailyRows: CampaignMetricRow[],
  key: CampaignKpiKey,
  days: number,
): number[] {
  const sorted = [...dailyRows].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-days);
  return recent.map((row) => {
    const values = kpisFromMetricRows([row]);
    return readKpiValue(values, key) ?? 0;
  });
}

function buildKpiCard(input: {
  key: CampaignKpiKey;
  primary: boolean;
  currentRows: CampaignMetricRow[];
  allDailyRows: CampaignMetricRow[];
  targets: BenchmarkValues | null;
  isDefault: boolean;
  minResults: number;
}): KpiCardView {
  const direction = kpiDirection(input.key);
  const currentValues = kpisFromMetricRows(input.currentRows);
  const current = readKpiValue(currentValues, input.key);
  const volumeOk =
    input.currentRows.reduce((s, r) => s + r.conversions, 0) >=
    input.minResults;

  let benchmarkValue: number | null;
  let benchmarkMin: number | null = null;
  let benchmarkMax: number | null = null;
  let gap: number | null = null;

  if (input.key === "frequency" && input.targets) {
    const range = readFrequencyRange(input.targets);
    benchmarkMin = range?.min ?? null;
    benchmarkMax = range?.max ?? null;
    benchmarkValue = frequencyRangeMid(range);
    if (current !== null && range) {
      gap = computeFrequencyRangeGap(current, range.min, range.max);
    }
  } else {
    benchmarkValue = input.targets
      ? readKpiValue(input.targets, input.key)
      : null;
    if (current !== null && benchmarkValue !== null) {
      gap = computeGap(current, benchmarkValue, direction);
    }
  }

  const hasTarget = benchmarkValue !== null;
  const status = hasTarget
    ? gapToStatus(gap, volumeOk || input.isDefault)
    : "not_enough_data";

  return {
    key: input.key,
    label: kpiLabel(input.key),
    primary: input.primary,
    direction,
    current,
    benchmark: benchmarkValue,
    benchmarkIsDefault: input.isDefault && hasTarget,
    benchmarkMin,
    benchmarkMax,
    gap,
    status,
    volumeOk,
    sparkline: sparklineForKpi(input.allDailyRows, input.key, 14),
  };
}

export function buildCampaignLearningView(input: {
  campaignId: string;
  campaignName: string;
  status: CampaignMetricRow["status"];
  objective: string | null;
  account: AdAccount;
  dailyRows: CampaignMetricRow[];
  kpiConfig: CampaignKpiConfig;
  benchmark: CampaignBenchmark | null;
  pendingBenchmark: CampaignBenchmark | null;
  rangeDays: number;
  chartKpi: CampaignKpiKey;
}): CampaignLearningView {
  const metricWindow = filterRowsByRange(input.dailyRows, input.rangeDays);
  const currentRows = metricWindow.rows;
  const keys: CampaignKpiKey[] = [
    input.kpiConfig.primaryKpi,
    ...input.kpiConfig.secondaryKpis.filter(
      (k) => k !== input.kpiConfig.primaryKpi,
    ),
  ].slice(0, 5);

  // Full stored history. rangeDays changes the cards and chart only.
  const defaultValues = input.benchmark
    ? null
    : idealBenchmarkValues(input.dailyRows, keys);
  const hasDefault =
    defaultValues !== null && Object.keys(defaultValues).length > 0;
  const targets = input.benchmark?.values ?? (hasDefault ? defaultValues : null);
  const isDefault = !input.benchmark && hasDefault;

  const kpis = keys.map((key) =>
    buildKpiCard({
      key,
      primary: key === input.kpiConfig.primaryKpi,
      currentRows,
      allDailyRows: input.dailyRows,
      targets,
      isDefault,
      minResults: input.kpiConfig.minResults,
    }),
  );

  const learningMode = resolveLearningMode({
    dailyRows: input.dailyRows,
    activeBenchmark: input.benchmark,
    primaryKpi: input.kpiConfig.primaryKpi,
    primaryDirection: input.kpiConfig.primaryDirection,
    minResults: input.kpiConfig.minResults,
  });

  // Same window as KPI cards — chart used to ignore rangeDays and looked empty/odd.
  const chartSource = [...currentRows].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const chartPoints = chartSource.map((row) => ({
    date: row.date.slice(0, 10),
    value: readKpiValue(kpisFromMetricRows([row]), input.chartKpi),
  }));

  return {
    campaignId: input.campaignId,
    campaignName: input.campaignName,
    platform: input.account.platform,
    status: input.status,
    objective: input.objective,
    clientName: input.account.clientName,
    currencyCode: input.account.currencyCode,
    lastSyncedAt: input.account.lastSyncedAt,
    isStale: isSyncStale(input.account.lastSyncedAt),
    learningMode,
    kpiConfig: input.kpiConfig,
    benchmark: input.benchmark,
    displayBenchmarkValues: targets,
    benchmarkIsDefault: isDefault,
    pendingBenchmark: input.pendingBenchmark,
    kpis,
    chartPoints,
    chartKpi: input.chartKpi,
    rangeNote: rangeNote(metricWindow.end),
  };
}
