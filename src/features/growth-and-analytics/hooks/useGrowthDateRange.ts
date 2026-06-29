import { useMemo } from "react";

import { useAnalyticsFilters } from "@/features/analytics/hooks/useAnalyticsFilters";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

import type { GrowthDateRange } from "../types/types";

// Bridges the shared analytics date filter (pills + range picker, synced to the
// URL) into a `{ from, to }` range the growth Supabase queries can use.
export function useGrowthDateRange() {
  const { resolvedRange, dateFilterProps, periodLabel } = useAnalyticsFilters();

  const fromKey = resolvedRange ? serializeUrlDate(resolvedRange.from) : "";
  const toKey = resolvedRange ? serializeUrlDate(resolvedRange.to) : "";

  const range = useMemo<GrowthDateRange>(
    () => (fromKey && toKey ? { from: fromKey, to: toKey } : {}),
    [fromKey, toKey],
  );

  return { range, dateFilterProps, periodLabel };
}
