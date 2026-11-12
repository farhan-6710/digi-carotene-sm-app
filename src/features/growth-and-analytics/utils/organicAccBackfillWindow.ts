import { addDays, subDays, startOfDay } from "date-fns";

import { INSTAGRAM_BACKFILL_DAYS } from "../constants/metaConfig";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { MetaSyncRange } from "./metaSyncMappers";

export function getOrganicAccBackfillWindow(): {
  from: Date;
  toExclusive: Date;
} {
  const todayStart = startOfDay(new Date());
  return {
    // 90 calendar days ending today (inclusive) for posts.
    from: startOfDay(subDays(todayStart, INSTAGRAM_BACKFILL_DAYS - 1)),
    toExclusive: startOfDay(addDays(todayStart, 1)),
  };
}

export function isWithinOrganicAccBackfillWindow(timestamp?: string): boolean {
  if (!timestamp) return false;
  const postedAt = new Date(timestamp);
  const { from, toExclusive } = getOrganicAccBackfillWindow();
  return postedAt >= from && postedAt < toExclusive;
}

/** Live connect/refetch post window — includes today. */
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
  return serializeUrlDate(startOfDay(subDays(new Date(), 1)));
}
