import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";

import {
  CUSTOM_REPORT_MAX_DAYS,
  type CustomReportPeriodId,
} from "../constants/customReport";

/** Same calendar windows as Content Performance / Campaign Analytics date filters. */
export function resolveCustomReportPeriod(
  periodId: CustomReportPeriodId,
  startDate: string,
  endDate: string,
  today = new Date(),
): { from: string; to: string } {
  if (periodId === "this_month") {
    return {
      from: format(startOfMonth(today), "yyyy-MM-dd"),
      to: format(endOfMonth(today), "yyyy-MM-dd"),
    };
  }

  if (periodId === "last_month") {
    const last = subMonths(today, 1);
    return {
      from: format(startOfMonth(last), "yyyy-MM-dd"),
      to: format(endOfMonth(last), "yyyy-MM-dd"),
    };
  }

  if (periodId === "last_3_months") {
    return {
      from: format(startOfMonth(subMonths(today, 2)), "yyyy-MM-dd"),
      to: format(endOfMonth(today), "yyyy-MM-dd"),
    };
  }

  return { from: startDate, to: endDate };
}

export function validateCustomReportRange(
  from: string,
  to: string,
): string | null {
  if (!from || !to) return "Choose a start and end date.";
  const start = parseISO(from);
  const end = parseISO(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Dates look invalid.";
  }
  if (end < start) return "End date must be on or after start date.";
  const days = differenceInCalendarDays(end, start) + 1;
  if (days > CUSTOM_REPORT_MAX_DAYS) {
    return `Date range can be at most ${CUSTOM_REPORT_MAX_DAYS} days.`;
  }
  return null;
}

export function formatCustomReportPeriodLabel(from: string, to: string): string {
  try {
    return `${format(parseISO(from), "d MMM yyyy")} – ${format(parseISO(to), "d MMM yyyy")}`;
  } catch {
    return `${from} – ${to}`;
  }
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
