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

function filterRowsByRange(
  rows: CampaignMetricRow[],
  rangeDays: number,
): CampaignMetricRow[] {
  if (rangeDays <= 0) return rows;
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(`${today}T00:00:00Z`);
  from.setUTCDate(from.getUTCDate() - (rangeDays - 1));
  const fromStr = from.toISOString().slice(0, 10);
  return rows.filter((r) => r.date.slice(0, 10) >= fromStr);
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
  const status = hasTarget ? gapToStatus(gap, volumeOk) : "not_enough_data";

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
  const currentRows = filterRowsByRange(input.dailyRows, input.rangeDays);
  const keys: CampaignKpiKey[] = [
    input.kpiConfig.primaryKpi,
    ...input.kpiConfig.secondaryKpis.filter(
      (k) => k !== input.kpiConfig.primaryKpi,
    ),
  ].slice(0, 5);

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
  };
}
