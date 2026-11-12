import {
  GAP_BELOW_MIN,
  GAP_ON_TRACK_MIN,
} from "../../constants/learning/campaignLearning";
import type { GapStatus, KpiDirection } from "../../types/types";

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
