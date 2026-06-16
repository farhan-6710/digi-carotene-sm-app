import {
  eachWeekOfInterval,
  endOfMonth,
  format,
  getDate,
  startOfMonth,
} from "date-fns";

import type { Week } from "@/features/posts-management/types/types";

export function toCalendarParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
}

export function isSameCalendarDay(
  a: Date,
  year: number,
  month: number,
  date: number,
) {
  return (
    a.getFullYear() === year &&
    a.getMonth() + 1 === month &&
    a.getDate() === date
  );
}

export function getDayLabel(year: number, month: number, date: number): string {
  return format(new Date(year, month - 1, date), "EEE");
}

export function buildMonthWeeks(year: number, month: number): Week[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const monthName = format(monthStart, "MMMM");

  const weekStarts = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 },
  );

  return weekStarts.map((weekStart, weekIndex) => {
    const dates = Array.from({ length: 7 }, (_, dayIndex) => {
      const cellDate = new Date(weekStart);
      cellDate.setDate(cellDate.getDate() + dayIndex);

      if (
        cellDate.getFullYear() !== year ||
        cellDate.getMonth() !== month - 1
      ) {
        return 0;
      }

      return getDate(cellDate);
    });

    const validDates = dates.filter((value) => value > 0);
    const range =
      validDates.length > 0
        ? `${monthName} ${validDates[0]} to ${monthName} ${validDates.at(-1)}`
        : "";

    return {
      label: `Week ${weekIndex + 1}`,
      range,
      dates,
    };
  });
}

export function formatMonthSelectorLabel(year: number, month: number): string {
  return format(new Date(year, month - 1, 1), "MMMM yyyy");
}

export function formatMonthDayLabel(
  year: number,
  month: number,
  date: number,
): string {
  return format(new Date(year, month - 1, date), "MMMM d");
}
