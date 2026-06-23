import { useCallback, useState, type KeyboardEvent } from "react";
import type { DateRange } from "react-day-picker";
import type { SetURLSearchParams } from "react-router";

import type { ReportDateRange } from "@/features/reports/types/types";
import {
  buildReportRangeSearchParams,
  parseReportDateRangeFromSearchParams,
} from "@/features/reports/utils/reportsUrlParams";
import type { PostStatusFilterState } from "@/shared/utils/postStatusFilterUtils";

type UseReportDatePickerOptions = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  appliedRange: ReportDateRange;
  statusFilter: PostStatusFilterState;
  loadReport: (
    from: Date,
    to: Date,
    statusFilter: PostStatusFilterState,
  ) => Promise<void>;
  syncStatusesToUrl: (filter: PostStatusFilterState) => void;
  setError: (message: string | null) => void;
};

export function useReportDatePicker({
  searchParams,
  setSearchParams,
  appliedRange,
  statusFilter,
  loadReport,
  syncStatusesToUrl,
  setError,
}: UseReportDatePickerOptions) {
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>(() =>
    parseReportDateRangeFromSearchParams(searchParams),
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const syncRangeToUrl = useCallback(
    (range: DateRange | undefined) => {
      setSearchParams(
        (current) => buildReportRangeSearchParams(range, current),
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const applyDateRange = useCallback(async () => {
    if (!pickerRange?.from) {
      setError("Select a start date for the report.");
      return;
    }

    const from = pickerRange.from;
    const to = pickerRange.to ?? pickerRange.from;

    if (to < from) {
      setError("End date must be on or after the start date.");
      return;
    }

    syncRangeToUrl({ from, to });
    syncStatusesToUrl(statusFilter);
    setIsPickerOpen(false);
    await loadReport(from, to, statusFilter);
  }, [
    loadReport,
    pickerRange,
    setError,
    statusFilter,
    syncRangeToUrl,
    syncStatusesToUrl,
  ]);

  const handlePickerRangeChange = useCallback((range: DateRange | undefined) => {
    setPickerRange(range);
    setError(null);
  }, [setError]);

  const handlePickerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setPickerRange(
          appliedRange.from
            ? { from: appliedRange.from, to: appliedRange.to ?? appliedRange.from }
            : undefined,
        );
        setError(null);
      }

      setIsPickerOpen(open);
    },
    [appliedRange.from, appliedRange.to, setError],
  );

  const handlePickerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void applyDateRange();
      }
    },
    [applyDateRange],
  );

  return {
    pickerRange,
    setPickerRange,
    isPickerOpen,
    applyDateRange,
    handlePickerRangeChange,
    handlePickerOpenChange,
    handlePickerKeyDown,
  };
}
