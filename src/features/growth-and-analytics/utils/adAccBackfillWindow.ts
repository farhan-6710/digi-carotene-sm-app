import { subDays, startOfDay } from "date-fns";

import { AD_BACKFILL_DAYS } from "../constants/metaConfig";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { MetaSyncRange } from "./metaSyncMappers";

export function getAdAccBackfillWindow(): {
  from: Date;
  toExclusive: Date;
} {
  const todayStart = startOfDay(new Date());
  return {
    from: startOfDay(subDays(todayStart, AD_BACKFILL_DAYS)),
    toExclusive: todayStart,
  };
}

/** Meta insights range for the 90 completed days (excludes today). */
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
  const { toExclusive } = getAdAccBackfillWindow();
  return serializeUrlDate(subDays(toExclusive, 1));
}
