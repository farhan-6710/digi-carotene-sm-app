import { useMemo } from "react";

import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import { MonthlyTrendChart } from "@/features/analytics/components/MonthlyTrendChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import { resolveAnalyticsDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import {
  buildMonthlyTrend,
  buildMonthlyTrendForRange,
  buildPlatformDistribution,
  buildStatusBreakdown,
} from "@/features/analytics/utils/postsAnalyticsCompute";

export function AgencyAnalyticsPanel({
  filteredPosts,
  filter,
  periodLabel,
}: AnalyticsPanelProps) {
  const view = useMemo(() => {
    const resolvedRange = resolveAnalyticsDateRange(filter);
    const trend = resolvedRange
      ? buildMonthlyTrendForRange(filteredPosts, resolvedRange)
      : buildMonthlyTrend(filteredPosts, 12);

    return {
      statusBreakdown: buildStatusBreakdown(filteredPosts),
      platforms: buildPlatformDistribution(filteredPosts),
      trend,
    };
  }, [filteredPosts, filter]);

  return (
    <div className="space-y-6">
      <MonthlyTrendChart
        title="Agency Publishing Trend"
        description={`Posts by status — ${periodLabel.toLowerCase()}.`}
        data={view.trend}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="Posts by Status"
          description={`Status split for ${periodLabel.toLowerCase()}.`}
          data={view.statusBreakdown}
          centerLabel="Posts"
        />
        <HorizontalBarChart
          title="Platform Mix"
          description={`Content distribution per platform — ${periodLabel.toLowerCase()}.`}
          data={view.platforms}
          color="var(--chart-3)"
          emptyMessage="No platform data in this period."
        />
      </div>
    </div>
  );
}
