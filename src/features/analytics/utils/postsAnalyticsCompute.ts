import type {
  AnalyticsResolvedDateRange,
  CategoryDatum,
  LabeledValue,
  MonthlyTrendDatum,
} from "@/features/analytics/types/types";
import {
  getMonthKey,
  getMonthsInRange,
  getRecentMonths,
} from "@/features/analytics/utils/analyticsDateUtils";
import {
  SOCIAL_PLATFORMS,
  statusLabels,
  statusOptions,
} from "@/features/posts-management/constants/postsManagement";
import type { Post, StatusKey } from "@/features/posts-management/types/types";

const STATUS_COLORS: Record<StatusKey, string> = {
  editing: "var(--status-editing)",
  sent_for_approval: "var(--status-sent-for-approval)",
  approved: "var(--status-approved)",
  scheduled: "var(--status-scheduled)",
  posted: "var(--status-posted)",
};

export function buildStatusBreakdown(posts: Post[]): CategoryDatum[] {
  return statusOptions.map((status) => ({
    key: status,
    label: statusLabels[status],
    value: posts.filter((post) => post.status === status).length,
    color: STATUS_COLORS[status],
  }));
}

export function buildPlatformDistribution(posts: Post[]): LabeledValue[] {
  return SOCIAL_PLATFORMS.map((platform) => ({
    label: platform,
    value: posts.filter((post) => post.socials?.includes(platform)).length,
  }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function buildMonthlyTrend(
  posts: Post[],
  monthsBack = 12,
): MonthlyTrendDatum[] {
  const months = getRecentMonths(monthsBack);
  return buildMonthlyTrendForMonths(posts, months);
}

export function buildMonthlyTrendForRange(
  posts: Post[],
  range: AnalyticsResolvedDateRange,
): MonthlyTrendDatum[] {
  const months = getMonthsInRange(range);
  return buildMonthlyTrendForMonths(posts, months);
}

function buildMonthlyTrendForMonths(
  posts: Post[],
  months: { key: string; label: string }[],
): MonthlyTrendDatum[] {
  const buckets = new Map<string, MonthlyTrendDatum>(
    months.map((month) => [
      month.key,
      { month: month.label, posted: 0, scheduled: 0, notPosted: 0 },
    ]),
  );

  for (const post of posts) {
    const bucket = buckets.get(getMonthKey(post.to_be_posted_date));
    if (!bucket) {
      continue;
    }

    if (post.status === "posted") {
      bucket.posted += 1;
    } else if (post.status === "scheduled") {
      bucket.scheduled += 1;
    } else {
      bucket.notPosted += 1;
    }
  }

  return months.map((month) => buckets.get(month.key)!);
}
