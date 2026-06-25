import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router";

import {
  ANALYTICS_QUICK_PERIODS,
  type AnalyticsQuickPeriodId,
} from "@/features/analytics/constants/analyticsFilters";
import {
  buildAnalyticsPeriodSearchParams,
  buildAnalyticsRangeSearchParams,
  clearAnalyticsFilterParams,
  parseAnalyticsDateRangeFromSearchParams,
  parseAnalyticsFilterFromSearchParams,
} from "@/features/analytics/utils/analyticsFilterUrlParams";
import {
  formatAnalyticsFilterLabel,
  formatAnalyticsRangeButtonLabel,
  resolveAnalyticsDateRange,
} from "@/features/analytics/utils/analyticsFilterUtils";

export function useAnalyticsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>(() =>
    parseAnalyticsDateRangeFromSearchParams(searchParams),
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const filter = useMemo(
    () => parseAnalyticsFilterFromSearchParams(searchParams),
    [searchParams],
  );

  const resolvedRange = useMemo(
    () => resolveAnalyticsDateRange(filter),
    [filter],
  );

  const periodLabel = useMemo(
    () => formatAnalyticsFilterLabel(filter),
    [filter],
  );

  const rangeButtonLabel = useMemo(
    () => formatAnalyticsRangeButtonLabel(filter),
    [filter],
  );

  const syncSearchParams = useCallback(
    (params: URLSearchParams) => {
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(false);
    syncSearchParams(
      buildAnalyticsPeriodSearchParams(null, searchParams),
    );
  }, [searchParams, syncSearchParams]);

  const toggleQuickPeriod = useCallback(
    (period: AnalyticsQuickPeriodId) => {
      setPickerError(null);
      setIsPickerOpen(false);

      const isActive = filter.mode === "period" && filter.period === period;
      syncSearchParams(
        buildAnalyticsPeriodSearchParams(
          isActive ? null : period,
          searchParams,
        ),
      );
    },
    [filter, searchParams, syncSearchParams],
  );

  const clearDateRange = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(false);
    setPickerRange(undefined);

    const params = new URLSearchParams(searchParams);
    clearAnalyticsFilterParams(params);
    syncSearchParams(params);
  }, [searchParams, syncSearchParams]);

  const applyDateRange = useCallback(() => {
    if (!pickerRange?.from) {
      setPickerError("Select a start date.");
      return;
    }

    const from = pickerRange.from;
    const to = pickerRange.to ?? pickerRange.from;

    if (to < from) {
      setPickerError("End date must be on or after the start date.");
      return;
    }

    setPickerError(null);
    setIsPickerOpen(false);
    syncSearchParams(
      buildAnalyticsRangeSearchParams({ from, to }, searchParams),
    );
  }, [pickerRange, searchParams, syncSearchParams]);

  const handlePickerRangeChange = useCallback((range: DateRange | undefined) => {
    setPickerRange(range);
    setPickerError(null);
  }, []);

  const handlePickerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setPickerRange(
          filter.mode === "range"
            ? { from: filter.from, to: filter.to }
            : undefined,
        );
        setPickerError(null);
      }

      setIsPickerOpen(open);
    },
    [filter],
  );

  const handlePickerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyDateRange();
      }
    },
    [applyDateRange],
  );

  const activeQuickPeriod =
    filter.mode === "period" ? filter.period : null;

  const isDateRangeActive = filter.mode === "range";

  return {
    filter,
    resolvedRange,
    periodLabel,
    rangeButtonLabel,
    quickPeriods: ANALYTICS_QUICK_PERIODS,
    activeQuickPeriod,
    isDateRangeActive,
    pickerRange,
    isPickerOpen,
    pickerError,
    toggleQuickPeriod,
    clearFilters,
    clearDateRange,
    applyDateRange,
    handlePickerRangeChange,
    handlePickerOpenChange,
    handlePickerKeyDown,
  };
}
