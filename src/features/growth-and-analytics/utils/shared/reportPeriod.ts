import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { GrowthDateRange } from "../types/types";

export function resolveGrowthReportPeriod(range: GrowthDateRange) {
  const today = serializeUrlDate(new Date());
  return {
    periodStart: range.from ?? today,
    periodEnd: range.to ?? today,
  };
}
