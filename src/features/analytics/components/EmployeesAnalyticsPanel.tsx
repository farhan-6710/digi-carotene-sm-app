import { useMemo } from "react";

import { AnalyticsBreakdownTable } from "@/features/analytics/components/AnalyticsBreakdownTable";
import { CategoryDonutChart } from "@/features/analytics/components/CategoryDonutChart";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import {
  buildManagerWorkload,
  buildManagerWorkloadChart,
  buildRoleDistribution,
} from "@/features/analytics/utils/teamAnalyticsCompute";

export function EmployeesAnalyticsPanel({
  data,
  filteredPosts,
  periodLabel,
  isLoading,
}: AnalyticsPanelProps) {
  const { projects, teamMembers } = data;

  const view = useMemo(() => {
    const workload = buildManagerWorkload(filteredPosts, projects, teamMembers);
    return {
      roleDistribution: buildRoleDistribution(teamMembers),
      workloadChart: buildManagerWorkloadChart(workload),
      workload,
    };
  }, [filteredPosts, projects, teamMembers]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          title="Team by Role"
          description="Current team composition."
          data={view.roleDistribution}
          centerLabel="Members"
        />
        <HorizontalBarChart
          title="Manager Workload"
          description={`Posts on managed projects — ${periodLabel.toLowerCase()}.`}
          data={view.workloadChart}
          color="var(--chart-3)"
          emptyMessage="No managed posts in this period."
        />
      </div>

      <AnalyticsBreakdownTable
        title="Manager Output Breakdown"
        nameHeader="Manager"
        rows={view.workload}
        isLoading={isLoading}
        emptyMessage="No managed posts in this period."
      />
    </div>
  );
}
