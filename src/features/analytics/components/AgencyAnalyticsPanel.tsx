import { useMemo } from "react";

import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import { MonthlyTrendChart } from "@/features/analytics/components/MonthlyTrendChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import { buildAgencyStatCards } from "@/features/analytics/utils/agencyAnalyticsCompute";
import {
  buildMonthlyTrend,
  buildPlatformDistribution,
  buildStatusBreakdown,
} from "@/features/analytics/utils/postsAnalyticsCompute";
import { StatsCards } from "@/shared/components/StatsCards";

export function AgencyAnalyticsPanel({ data, isLoading }: AnalyticsPanelProps) {
  const { posts } = data;

  const view = useMemo(
    () => ({
      stats: buildAgencyStatCards(posts),
      statusBreakdown: buildStatusBreakdown(posts),
      platforms: buildPlatformDistribution(posts),
      trend: buildMonthlyTrend(posts, 12),
    }),
    [posts],
  );

  return (
    <div className="space-y-6">
      <StatsCards cards={view.stats} isLoading={isLoading} />

      <MonthlyTrendChart
        title="Agency Publishing Trend"
        description="All posts by status over the last 12 months."
        data={view.trend}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="All-time by Status"
          description="Lifetime split of every post."
          data={view.statusBreakdown}
          centerLabel="Posts"
        />
        <HorizontalBarChart
          title="Platform Mix"
          description="All-time content distribution per platform."
          data={view.platforms}
          color="var(--chart-3)"
          emptyMessage="No platform data yet."
        />
      </div>
    </div>
  );
}
