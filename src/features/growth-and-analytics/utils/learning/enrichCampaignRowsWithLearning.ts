import type {
  CampaignBenchmark,
  CampaignMetricRow,
  CampaignRow,
  GapStatus,
  LearningModeState,
} from "../../types/types";
import { LEARNING_MIN_HISTORY_DAYS } from "../../constants/learning/campaignLearning";
import { defaultKpisForCampaign, kpiLabel } from "./defaultCampaignKpis";
import {
  computeFrequencyRangeGap,
  computeGap,
  frequencyRangeMid,
  gapToStatus,
  readFrequencyRange,
} from "./gapStatus";
import { countDaysOfData } from "./autoBenchmark";
import { kpisFromMetricRows, readKpiValue } from "./kpiFromMetrics";

export function enrichCampaignRowsWithLearning(
  rows: CampaignRow[],
  metrics: CampaignMetricRow[],
  benchmarks: CampaignBenchmark[],
  platform: CampaignBenchmark["platform"],
): CampaignRow[] {
  const byCampaign = new Map<string, CampaignMetricRow[]>();
  for (const row of metrics) {
    const list = byCampaign.get(row.campaignId) ?? [];
    list.push(row);
    byCampaign.set(row.campaignId, list);
  }

  const benchByCampaign = new Map(
    benchmarks.map((b) => [b.campaignId, b] as const),
  );

  return rows.map((row) => {
    const campaignMetrics = byCampaign.get(row.id) ?? [];
    const benchmark = benchByCampaign.get(row.id) ?? null;
    const defaults = defaultKpisForCampaign(platform, row.objective);
    const primaryKpi = defaults.primaryKpi;
    const direction = defaults.primaryDirection;
    const currentValues = kpisFromMetricRows(campaignMetrics);
    const current = readKpiValue(currentValues, primaryKpi);
    let benchmarkValue: number | null = null;
    let gap: number | null = null;
    if (primaryKpi === "frequency" && benchmark) {
      const range = readFrequencyRange(benchmark.values);
      benchmarkValue = frequencyRangeMid(range);
      if (current !== null && range) {
        gap = computeFrequencyRangeGap(current, range.min, range.max);
      }
    } else {
      benchmarkValue = benchmark
        ? readKpiValue(benchmark.values, primaryKpi)
        : null;
      if (current !== null && benchmarkValue !== null) {
        gap = computeGap(current, benchmarkValue, direction);
      }
    }
    const volumeOk =
      campaignMetrics.reduce((s, r) => s + r.conversions, 0) >= 10;
    const gapStatus: GapStatus | null = benchmark
      ? gapToStatus(gap, volumeOk)
      : null;
    const days = countDaysOfData(campaignMetrics);
    const learningMode: LearningModeState = benchmark
      ? "tracking"
      : days < LEARNING_MIN_HISTORY_DAYS
        ? "collecting"
        : "collecting";

    return {
      ...row,
      primaryKpiCurrent: current,
      primaryKpiLabel: kpiLabel(primaryKpi),
      benchmarkValue,
      gap,
      gapStatus,
      learningMode,
    };
  });
}
