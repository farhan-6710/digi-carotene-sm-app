import type { DateRange } from "react-day-picker";

import {
  ANALYTICS_FROM_PARAM,
  ANALYTICS_PERIOD_PARAM,
  ANALYTICS_QUICK_PERIODS,
  ANALYTICS_TO_PARAM,
  type AnalyticsQuickPeriodId,
} from "@/features/analytics/constants/analyticsFilters";
import type { AnalyticsDateFilterState } from "@/features/analytics/types/types";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

const validPeriodIds = new Set<string>(
  ANALYTICS_QUICK_PERIODS.map((period) => period.id),
);

export function parseAnalyticsQuickPeriod(
  value: string | null,
): AnalyticsQuickPeriodId | null {
  if (value && validPeriodIds.has(value)) {
    return value as AnalyticsQuickPeriodId;
  }

  return null;
}

export function parseAnalyticsDateRangeFromSearchParams(
  searchParams: URLSearchParams,
): DateRange | undefined {
  const from = parseUrlDateParam(searchParams.get(ANALYTICS_FROM_PARAM));
  if (!from) {
    return undefined;
  }

  const to = parseUrlDateParam(searchParams.get(ANALYTICS_TO_PARAM));

  return {
    from,
    to: to ?? undefined,
  };
}

export function parseAnalyticsFilterFromSearchParams(
  searchParams: URLSearchParams,
): AnalyticsDateFilterState {
  const period = parseAnalyticsQuickPeriod(
    searchParams.get(ANALYTICS_PERIOD_PARAM),
  );

  if (period) {
    return { mode: "period", period };
  }

  const range = parseAnalyticsDateRangeFromSearchParams(searchParams);
  if (range?.from) {
    return {
      mode: "range",
      from: range.from,
      to: range.to ?? range.from,
    };
  }

  return { mode: "all" };
}

export function clearAnalyticsFilterParams(params: URLSearchParams): void {
  params.delete(ANALYTICS_PERIOD_PARAM);
  params.delete(ANALYTICS_FROM_PARAM);
  params.delete(ANALYTICS_TO_PARAM);
}

export function buildAnalyticsPeriodSearchParams(
  period: AnalyticsQuickPeriodId | null,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);
  clearAnalyticsFilterParams(params);

  if (period) {
    params.set(ANALYTICS_PERIOD_PARAM, period);
  }

  return params;
}

export function buildAnalyticsRangeSearchParams(
  range: DateRange | undefined,
  existing?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(existing);
  clearAnalyticsFilterParams(params);

  if (range?.from) {
    params.set(ANALYTICS_FROM_PARAM, serializeUrlDate(range.from));

    if (range.to) {
      params.set(ANALYTICS_TO_PARAM, serializeUrlDate(range.to));
    }
  }

  return params;
}
