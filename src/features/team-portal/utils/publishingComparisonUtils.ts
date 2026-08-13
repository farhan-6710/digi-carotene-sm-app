import { format, getDaysInMonth } from "date-fns";

import type { Post } from "@/features/posts-management/types/types";
import type { PublishingComparisonPoint } from "@/features/team-portal/types/types";

/** Day-of-month for chart buckets — schedule day, same as the posts calendar. */
function publishingDayOfMonth(post: Post): number | null {
  const date = post.to_be_posted_date;
  if (!date || date.length < 10) {
    return null;
  }

  const day = Number(date.slice(8, 10));
  if (!Number.isFinite(day) || day < 1) {
    return null;
  }

  return day;
}

function countPostedByDayOfMonth(posts: Post[]): Map<number, number> {
  const counts = new Map<number, number>();

  for (const post of posts) {
    const day = publishingDayOfMonth(post);
    if (day === null) {
      continue;
    }

    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  return counts;
}

export function buildPublishingComparisonChart(input: {
  currentYear: number;
  currentMonth: number;
  previousYear: number;
  previousMonth: number;
  currentMonthPosts: Post[];
  previousMonthPosts: Post[];
}): {
  points: PublishingComparisonPoint[];
  currentMonthLabel: string;
  previousMonthLabel: string;
  currentTotal: number;
  previousTotal: number;
  growthPercent: number | null;
} {
  const currentDate = new Date(input.currentYear, input.currentMonth - 1, 1);
  const previousDate = new Date(input.previousYear, input.previousMonth - 1, 1);
  const dayCount = Math.max(
    getDaysInMonth(currentDate),
    getDaysInMonth(previousDate),
  );

  const currentByDay = countPostedByDayOfMonth(input.currentMonthPosts);
  const previousByDay = countPostedByDayOfMonth(input.previousMonthPosts);

  const points: PublishingComparisonPoint[] = [];
  let currentTotal = 0;
  let previousTotal = 0;

  for (let day = 1; day <= dayCount; day += 1) {
    const currentMonthCount = currentByDay.get(day) ?? 0;
    const previousMonthCount = previousByDay.get(day) ?? 0;
    currentTotal += currentMonthCount;
    previousTotal += previousMonthCount;
    points.push({
      day: String(day),
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
    });
  }

  let growthPercent: number | null = null;
  if (previousTotal > 0) {
    growthPercent = ((currentTotal - previousTotal) / previousTotal) * 100;
  } else if (currentTotal > 0) {
    growthPercent = 100;
  }

  return {
    points,
    currentMonthLabel: format(currentDate, "MMM yyyy"),
    previousMonthLabel: format(previousDate, "MMM yyyy"),
    currentTotal,
    previousTotal,
    growthPercent,
  };
}
