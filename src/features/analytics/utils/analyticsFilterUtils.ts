import {
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
  subYears,
} from "date-fns";

import type { AnalyticsQuickPeriodId } from "@/features/analytics/constants/analyticsFilters";
import type {
  AnalyticsDateFilterState,
  AnalyticsResolvedDateRange,
} from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";
import { serializeUrlDate } from "@/shared/utils/urlDateParams";

export function resolveAnalyticsDateRange(
  filter: AnalyticsDateFilterState,
  referenceDate = new Date(),
): AnalyticsResolvedDateRange | null {
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

  const fromByPeriod: Record<AnalyticsQuickPeriodId, Date> = {
    "7d": startOfDay(subDays(today, 6)),
    "1m": startOfDay(subMonths(today, 1)),
    "6m": startOfDay(subMonths(today, 6)),
    "1y": startOfDay(subYears(today, 1)),
  };

  return {
    from: fromByPeriod[filter.period],
    to: today,
  };
}

export function filterPostsByDateRange(
  posts: Post[],
  range: AnalyticsResolvedDateRange,
): Post[] {
  const from = serializeUrlDate(range.from);
  const to = serializeUrlDate(range.to);

  return posts.filter(
    (post) => post.to_be_posted_date >= from && post.to_be_posted_date <= to,
  );
}

export function filterPostsByAnalyticsFilter(
  posts: Post[],
  filter: AnalyticsDateFilterState,
  referenceDate = new Date(),
): Post[] {
  const range = resolveAnalyticsDateRange(filter, referenceDate);
  if (!range) {
    return posts;
  }

  return filterPostsByDateRange(posts, range);
}

export function formatAnalyticsFilterLabel(
  filter: AnalyticsDateFilterState,
): string {
  if (filter.mode === "all") {
    return "All time";
  }

  if (filter.mode === "period") {
    const labels: Record<AnalyticsQuickPeriodId, string> = {
      "7d": "Last 7 days",
      "1m": "Last month",
      "6m": "Last 6 months",
      "1y": "Last year",
    };

    return labels[filter.period];
  }

  if (format(filter.from, "yyyy-MM-dd") === format(filter.to, "yyyy-MM-dd")) {
    return format(filter.from, "MMM d, yyyy");
  }

  return `${format(filter.from, "MMM d, yyyy")} – ${format(filter.to, "MMM d, yyyy")}`;
}

export function formatAnalyticsRangeButtonLabel(
  filter: AnalyticsDateFilterState,
): string {
  if (filter.mode === "range") {
    return formatAnalyticsFilterLabel(filter);
  }

  return "Date range";
}
