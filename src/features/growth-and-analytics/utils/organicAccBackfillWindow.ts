import { subDays, startOfDay } from "date-fns";

import { INSTAGRAM_BACKFILL_DAYS } from "../constants/metaConfig";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { MetaSyncRange } from "./metaSyncMappers";

export function getOrganicAccBackfillWindow(): {
  from: Date;
  toExclusive: Date;
} {
  const todayStart = startOfDay(new Date());
  return {
    from: startOfDay(subDays(todayStart, INSTAGRAM_BACKFILL_DAYS)),
    toExclusive: todayStart,
  };
}

export function isWithinOrganicAccBackfillWindow(timestamp?: string): boolean {
  if (!timestamp) return false;
  const postedAt = new Date(timestamp);
  const { from, toExclusive } = getOrganicAccBackfillWindow();
  return postedAt >= from && postedAt < toExclusive;
}

/** Meta insights range for the 29 completed days (excludes today). */
export function getOrganicAccBackfillMetaRange(): MetaSyncRange {
  const { from, toExclusive } = getOrganicAccBackfillWindow();
  const to = subDays(toExclusive, 1);

  return {
    from: serializeUrlDate(from),
    to: serializeUrlDate(to),
    sinceUnix: String(Math.floor(from.getTime() / 1000)),
    untilUnix: String(Math.floor(startOfDay(to).getTime() / 1000)),
  };
}

export function getOrganicAccYesterdayDateString(): string {
  const { toExclusive } = getOrganicAccBackfillWindow();
  return serializeUrlDate(subDays(toExclusive, 1));
}
