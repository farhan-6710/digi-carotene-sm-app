import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router";

import {
  parsePostsListDateRange,
  setPostsListDateRange,
} from "@/features/posts-management/utils/postsManagementUrlParams";

function formatListRangeLabel(range: DateRange | undefined): string {
  if (!range?.from) return "Date range";
  const to = range.to ?? range.from;
  if (format(range.from, "yyyy-MM-dd") === format(to, "yyyy-MM-dd")) {
    return format(range.from, "MMM d, yyyy");
  }
  return `${format(range.from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}

export function usePostsListDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedRange = useMemo(
    () => parsePostsListDateRange(searchParams),
    [searchParams],
  );

  const [pickerRange, setPickerRange] = useState<DateRange | undefined>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const isDateRangeActive = Boolean(appliedRange?.from);
  const rangeButtonLabel = useMemo(
    () => formatListRangeLabel(appliedRange),
    [appliedRange],
  );

  const clearDateRange = useCallback(() => {
    setPickerError(null);
    setIsPickerOpen(false);
    setPickerRange(undefined);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        setPostsListDateRange(next, null);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        setPostsListDateRange(next, { from, to });
        return next;
      },
      { replace: true },
    );
  }, [pickerRange, setSearchParams]);

  const handlePickerRangeChange = useCallback((range: DateRange | undefined) => {
    setPickerRange(range);
    setPickerError(null);
  }, []);

  const handlePickerOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setPickerRange(
          appliedRange?.from
            ? { from: appliedRange.from, to: appliedRange.to ?? appliedRange.from }
            : undefined,
        );
        setPickerError(null);
      }
      setIsPickerOpen(open);
    },
    [appliedRange],
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

  return {
    appliedRange,
    isDateRangeActive,
    rangeButtonLabel,
    pickerRange,
    isPickerOpen,
    pickerError,
    onClearDateRange: clearDateRange,
    onApplyDateRange: applyDateRange,
    onPickerRangeChange: handlePickerRangeChange,
    onPickerOpenChange: handlePickerOpenChange,
    onPickerKeyDown: handlePickerKeyDown,
  };
}
