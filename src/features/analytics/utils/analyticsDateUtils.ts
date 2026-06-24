import { eachMonthOfInterval, format, subMonths } from "date-fns";

import type { AnalyticsResolvedDateRange } from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";

/** Month bucket key like "2026-06" derived from a "YYYY-MM-DD" string. */
export function getMonthKey(dateString: string): string {
  return dateString.slice(0, 7);
}

export function getCurrentMonthKey(referenceDate = new Date()): string {
  return format(referenceDate, "yyyy-MM");
}

export function getPreviousMonthKey(referenceDate = new Date()): string {
  return format(subMonths(referenceDate, 1), "yyyy-MM");
}

export function isPostInMonth(post: Post, monthKey: string): boolean {
  return getMonthKey(post.to_be_posted_date) === monthKey;
}

/** Ordered list of the last `count` months ending at the reference month. */
export function getRecentMonths(
  count: number,
  referenceDate = new Date(),
): { key: string; label: string }[] {
  return Array.from({ length: count }, (_, index) => {
    const date = subMonths(referenceDate, count - 1 - index);
    return { key: format(date, "yyyy-MM"), label: format(date, "MMM") };
  });
}

export function getMonthsInRange(
  range: AnalyticsResolvedDateRange,
): { key: string; label: string }[] {
  const months = eachMonthOfInterval({
    start: range.from,
    end: range.to,
  });

  return months.map((date) => ({
    key: format(date, "yyyy-MM"),
    label: format(date, "MMM yyyy"),
  }));
}
