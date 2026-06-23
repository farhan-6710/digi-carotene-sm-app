import { useMemo } from "react";

import { AnalyticsBreakdownTable } from "@/features/analytics/components/AnalyticsBreakdownTable";
import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import {
  buildManagerWorkload,
  buildManagerWorkloadChart,
  buildRoleDistribution,
  buildTeamStatCards,
} from "@/features/analytics/utils/teamAnalyticsCompute";
import { StatsCards } from "@/shared/components/StatsCards";

export function EmployeesAnalyticsPanel({ data, isLoading }: AnalyticsPanelProps) {
  const { posts, projects, teamMembers } = data;

  const view = useMemo(() => {
    const workload = buildManagerWorkload(posts, projects, teamMembers);
    return {
      stats: buildTeamStatCards(teamMembers, projects),
      roleDistribution: buildRoleDistribution(teamMembers),
      workloadChart: buildManagerWorkloadChart(workload),
      workload,
    };
  }, [posts, projects, teamMembers]);

  return (
    <div className="space-y-6">
      <StatsCards cards={view.stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="Team by Role"
          description="Distribution of members across roles."
          data={view.roleDistribution}
          centerLabel="Members"
        />
        <HorizontalBarChart
          title="Manager Workload"
          description="Posts on projects each manager owns."
          data={view.workloadChart}
          color="var(--chart-3)"
          emptyMessage="No managed posts yet."
        />
      </div>

      <AnalyticsBreakdownTable
        title="Manager Output Breakdown"
        nameHeader="Manager"
        rows={view.workload}
        isLoading={isLoading}
        emptyMessage="No managed posts yet."
      />
    </div>
  );
}
