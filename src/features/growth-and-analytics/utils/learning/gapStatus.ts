import {
  GAP_BELOW_MIN,
  GAP_ON_TRACK_MIN,
} from "../../constants/learning/campaignLearning";
import type {
  BenchmarkValues,
  GapStatus,
  KpiDirection,
} from "../../types/types";

/** Direction-aware gap: positive = better than benchmark (PDF §7.5). */
export function computeGap(
  current: number,
  benchmark: number,
  direction: KpiDirection,
): number | null {
  if (benchmark === 0) return null;
  if (direction === "lower") {
    return (benchmark - current) / benchmark;
  }
  return (current - benchmark) / benchmark;
}

/**
 * Frequency ideal band: inside [min, max] → gap 0 (on track).
 * Outside → negative distance from nearest edge / mid (same §7.5 thresholds).
 */
export function computeFrequencyRangeGap(
  current: number,
  min: number,
  max: number,
): number | null {
  if (!(min > 0) || max < min) return null;
  if (current >= min && current <= max) return 0;
  const mid = (min + max) / 2 || 1;
  if (current < min) return -((min - current) / mid);
  return -((current - max) / mid);
}

export function readFrequencyRange(
  values: BenchmarkValues | null | undefined,
): { min: number; max: number } | null {
  if (!values) return null;
  const min = values.frequency_min;
  const max = values.frequency_max;
  if (
    typeof min === "number" &&
    typeof max === "number" &&
    !Number.isNaN(min) &&
    !Number.isNaN(max) &&
    min > 0 &&
    max >= min
  ) {
    return { min, max };
  }
  const single = values.frequency;
  if (typeof single === "number" && single > 0) {
    return { min: single, max: single };
  }
  return null;
}

/** Midpoint for chart ReferenceLine / list columns when a band exists. */
export function frequencyRangeMid(
  range: { min: number; max: number } | null,
): number | null {
  if (!range) return null;
  return (range.min + range.max) / 2;
}

export function gapToStatus(
  gap: number | null,
  volumeOk: boolean,
): GapStatus {
  if (!volumeOk || gap === null) return "not_enough_data";
  if (gap >= GAP_ON_TRACK_MIN) return "on_track";
  if (gap >= GAP_BELOW_MIN) return "below";
  return "off_track";
}

export function formatGapPercent(gap: number | null): string {
  if (gap === null) return "—";
  const pct = Math.round(gap * 100);
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export function gapStatusLabel(status: GapStatus): string {
  switch (status) {
    case "on_track":
      return "On track";
    case "below":
      return "Below";
    case "off_track":
      return "Off track";
    case "not_enough_data":
      return "Not enough data";
  }
}
