import { useMemo } from "react";

import { useDateFiltersTwo } from "@/shared/hooks/useDateFiltersTwo";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { GrowthDateRange } from "../types/types";

// Bridges DateFiltersTwo into a `{ from, to }` range growth queries can use.
export function useGrowthDateRange() {
  const { resolvedRange, dateFilterProps, periodLabel } = useDateFiltersTwo();

  const fromKey = resolvedRange ? serializeUrlDate(resolvedRange.from) : "";
  const toKey = resolvedRange ? serializeUrlDate(resolvedRange.to) : "";

  const range = useMemo<GrowthDateRange>(
    () => (fromKey && toKey ? { from: fromKey, to: toKey } : {}),
    [fromKey, toKey],
  );

  return { range, dateFilterProps, periodLabel };
}
