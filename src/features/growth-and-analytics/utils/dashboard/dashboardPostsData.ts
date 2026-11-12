import type { DashboardPostsDataMetric } from "../constants/dashboardPostsData";
import type { DailyMetricRow, TrendPoint } from "../types/types";
import { monthLabel } from "./formatters";

const POSTS_DATA_METRIC_FIELD: Record<
  DashboardPostsDataMetric,
  keyof Pick<
    DailyMetricRow,
    | "reach"
    | "impressions"
    | "saves"
    | "shares"
    | "likes"
    | "comments"
    | "reposts"
  >
> = {
  reach: "reach",
  views: "impressions",
  saves: "saves",
  shares: "shares",
  likes: "likes",
  comments: "comments",
  reposts: "reposts",
};

export function buildPostsDataTrend(
  rows: DailyMetricRow[],
  metric: DashboardPostsDataMetric,
): TrendPoint[] {
  const field = POSTS_DATA_METRIC_FIELD[metric];
  const byDate = new Map<string, number>();

  for (const row of rows) {
    byDate.set(row.date, (byDate.get(row.date) ?? 0) + row[field]);
  }

  const byMonth = new Map<string, { label: string; value: number }>();

  for (const date of [...byDate.keys()].sort()) {
    const value = byDate.get(date) ?? 0;
    const key = date.slice(0, 7);
    const current = byMonth.get(key) ?? {
      label: monthLabel(date),
      value: 0,
    };
    current.value += value;
    byMonth.set(key, current);
  }

  return [...byMonth.values()];
}
