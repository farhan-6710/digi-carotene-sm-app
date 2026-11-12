import { addDays, subDays, startOfDay } from "date-fns";

import { AD_BACKFILL_DAYS } from "../constants/metaConfig";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { MetaSyncRange } from "./metaSyncMappers";

export function getAdAccBackfillWindow(): {
  from: Date;
  toExclusive: Date;
} {
  const todayStart = startOfDay(new Date());
  return {
    // 90 calendar days ending today (inclusive).
    from: startOfDay(subDays(todayStart, AD_BACKFILL_DAYS - 1)),
    toExclusive: startOfDay(addDays(todayStart, 1)),
  };
}

/** Live connect/refetch range — includes today (partial day from Meta is OK). */
export function getAdAccBackfillMetaRange(): MetaSyncRange {
  const { from, toExclusive } = getAdAccBackfillWindow();
  const to = subDays(toExclusive, 1);

  return {
    from: serializeUrlDate(from),
    to: serializeUrlDate(to),
    sinceUnix: String(Math.floor(from.getTime() / 1000)),
    untilUnix: String(Math.floor(startOfDay(to).getTime() / 1000)),
  };
}

export function getAdAccYesterdayDateString(): string {
  return serializeUrlDate(startOfDay(subDays(new Date(), 1)));
}
