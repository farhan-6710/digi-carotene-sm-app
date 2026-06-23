import { useMemo } from "react";

import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import { MonthlyTrendChart } from "@/features/analytics/components/MonthlyTrendChart";
import { SessionActivityGraph } from "@/features/analytics/components/SessionActivityGraph";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import { getCurrentMonthKey, isPostInMonth } from "@/features/analytics/utils/analyticsDateUtils";
import { buildPostsAnalyticsStatCards } from "@/features/analytics/utils/analyticsStatsUtils";
import {
  buildMonthlyTrend,
  buildPlatformDistribution,
  buildStatusBreakdown,
} from "@/features/analytics/utils/postsAnalyticsCompute";
import {
  buildPostsTopClients,
  getPostsAnalyticsMonthRange,
} from "@/features/analytics/utils/postsAnalyticsUtils";
import { StatsCards } from "@/shared/components/StatsCards";

export function PostsAnalyticsPanel({ data, isLoading }: AnalyticsPanelProps) {
  const { posts } = data;

  const view = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();
    const { previousYear, previousMonth } = getPostsAnalyticsMonthRange();
    const previousMonthKey = `${previousYear}-${String(previousMonth).padStart(2, "0")}`;

    const currentMonthPosts = posts.filter((post) => isPostInMonth(post, currentMonthKey));
    const previousMonthPosts = posts.filter((post) => isPostInMonth(post, previousMonthKey));

    return {
      stats: buildPostsAnalyticsStatCards(currentMonthPosts, previousMonthPosts),
      topClients: buildPostsTopClients(currentMonthPosts),
      statusBreakdown: buildStatusBreakdown(currentMonthPosts),
      platforms: buildPlatformDistribution(currentMonthPosts),
      trend: buildMonthlyTrend(posts, 12),
    };
  }, [posts]);

  return (
    <div className="space-y-6">
      <StatsCards cards={view.stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="This Month by Status"
          description="Status split of posts scheduled this month."
          data={view.statusBreakdown}
          centerLabel="Posts"
        />
        <HorizontalBarChart
          title="Posts by Platform"
          description="Where this month's content is going out."
          data={view.platforms}
          emptyMessage="No platform data for this month yet."
        />
      </div>

      <MonthlyTrendChart
        title="Publishing Trend"
        description="Posts by status over the last 12 months."
        data={view.trend}
      />

      <PostsTopClientsTable clients={view.topClients} isLoading={isLoading} />
      <SessionActivityGraph />
    </div>
  );
}
