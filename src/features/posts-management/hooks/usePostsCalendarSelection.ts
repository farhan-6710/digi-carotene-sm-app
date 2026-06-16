import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  buildPostsDateSearchParams,
  parsePostsDateFromSearchParams,
} from "@/features/posts-management/utils/postsManagementUrlParams";
import {
  buildMonthWeeks,
  toCalendarParts,
} from "@/features/posts-management/utils/calendarUtils";

function resolveSelectedDate(searchParams: URLSearchParams): Date {
  return parsePostsDateFromSearchParams(searchParams) ?? new Date();
}

export function usePostsCalendarSelection() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (parsePostsDateFromSearchParams(searchParams)) {
      return;
    }

    setSearchParams(buildPostsDateSearchParams(new Date(), searchParams), {
      replace: true,
    });
  }, [searchParams, setSearchParams]);

  const selectedDate = useMemo(
    () => resolveSelectedDate(searchParams),
    [searchParams],
  );

  const { year, month } = useMemo(
    () => toCalendarParts(selectedDate),
    [selectedDate],
  );

  const calendarWeeks = useMemo(
    () => buildMonthWeeks(year, month),
    [year, month],
  );

  const selectDate = useCallback(
    (date: Date) => {
      setSearchParams(buildPostsDateSearchParams(date, searchParams), {
        replace: true,
      });
    },
    [searchParams, setSearchParams],
  );

  return {
    selectedDate,
    calendarWeeks,
    year,
    month,
    selectDate,
  };
}
