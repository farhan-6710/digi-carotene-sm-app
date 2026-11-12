export const DASHBOARD_POSTS_DATA_METRICS = [
  { id: "reach", label: "Reach" },
  { id: "views", label: "Views" },
  { id: "saves", label: "Saves" },
  { id: "shares", label: "Share" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "reposts", label: "Reposts" },
] as const;

export type DashboardPostsDataMetric =
  (typeof DASHBOARD_POSTS_DATA_METRICS)[number]["id"];

export const DASHBOARD_POSTS_DATA_METRIC_LABEL: Record<
  DashboardPostsDataMetric,
  string
> = Object.fromEntries(
  DASHBOARD_POSTS_DATA_METRICS.map((metric) => [metric.id, metric.label]),
) as Record<DashboardPostsDataMetric, string>;
