import { useMemo } from "react";

import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import { MonthlyTrendChart } from "@/features/analytics/components/MonthlyTrendChart";
import { SessionActivityGraph } from "@/features/analytics/components/SessionActivityGraph";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import { resolveAnalyticsDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import {
  buildMonthlyTrend,
  buildMonthlyTrendForRange,
  buildPlatformDistribution,
  buildStatusBreakdown,
} from "@/features/analytics/utils/postsAnalyticsCompute";
import { buildPostsTopClients } from "@/features/analytics/utils/postsAnalyticsUtils";

export function PostsAnalyticsPanel({
  filteredPosts,
  filter,
  periodLabel,
  isLoading,
}: AnalyticsPanelProps) {
  const view = useMemo(() => {
    const resolvedRange = resolveAnalyticsDateRange(filter);
    const trend = resolvedRange
      ? buildMonthlyTrendForRange(filteredPosts, resolvedRange)
      : buildMonthlyTrend(filteredPosts, 12);

    return {
      topClients: buildPostsTopClients(filteredPosts),
      statusBreakdown: buildStatusBreakdown(filteredPosts),
      platforms: buildPlatformDistribution(filteredPosts),
      trend,
    };
  }, [filteredPosts, filter]);

  const scopeLabel =
    filter.mode === "all" ? "All scheduled posts." : `Posts in ${periodLabel.toLowerCase()}.`;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="Posts by Status"
          description={scopeLabel}
          data={view.statusBreakdown}
          centerLabel="Posts"
        />
        <HorizontalBarChart
          title="Posts by Platform"
          description={`Platform split for ${periodLabel.toLowerCase()}.`}
          data={view.platforms}
          emptyMessage="No platform data for this period."
        />
      </div>

      <MonthlyTrendChart
        title="Publishing Trend"
        description={`Posts by status — ${periodLabel.toLowerCase()}.`}
        data={view.trend}
      />

      <PostsTopClientsTable clients={view.topClients} isLoading={isLoading} />
      <SessionActivityGraph />
    </div>
  );
}
