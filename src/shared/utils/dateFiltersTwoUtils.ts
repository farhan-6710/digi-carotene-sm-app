import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";

import type { DateFiltersTwoPeriodId } from "@/shared/constants/dateFiltersTwo";
import type { DateFiltersTwoFilterState } from "@/shared/types/components";

export type DateFiltersTwoResolvedRange = {
  from: Date;
  to: Date;
};

export function resolveDateFiltersTwoRange(
  filter: DateFiltersTwoFilterState,
  referenceDate = new Date(),
): DateFiltersTwoResolvedRange | null {
  const today = endOfDay(referenceDate);

  if (filter.mode === "all") {
    return null;
  }

  if (filter.mode === "range") {
    return {
      from: startOfDay(filter.from),
      to: endOfDay(filter.to),
    };
  }

  if (filter.period === "this_month") {
    return {
      from: startOfMonth(today),
      to: today,
    };
  }

  if (filter.period === "last_month") {
    const lastMonth = subMonths(today, 1);
    return {
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth),
    };
  }

  return {
    from: startOfMonth(subMonths(today, 2)),
    to: today,
  };
}

export function formatDateFiltersTwoLabel(
  filter: DateFiltersTwoFilterState,
): string {
  if (filter.mode === "all") {
    return "All";
  }

  if (filter.mode === "period") {
    const labels: Record<DateFiltersTwoPeriodId, string> = {
      this_month: "This Month",
      last_month: "Last Month",
      last_3_months: "Last 3 Months",
    };
    return labels[filter.period];
  }

  if (format(filter.from, "yyyy-MM-dd") === format(filter.to, "yyyy-MM-dd")) {
    return format(filter.from, "MMM d, yyyy");
  }

  return `${format(filter.from, "MMM d, yyyy")} – ${format(filter.to, "MMM d, yyyy")}`;
}

export function formatDateFiltersTwoRangeButtonLabel(
  filter: DateFiltersTwoFilterState,
): string {
  if (filter.mode === "range") {
    return formatDateFiltersTwoLabel(filter);
  }

  return "Date range";
}
