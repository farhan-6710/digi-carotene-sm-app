import { useMemo } from "react";

import { AnalyticsBreakdownTable } from "@/features/analytics/components/AnalyticsBreakdownTable";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import {
  buildClientBreakdowns,
  buildTopClientsByPosts,
} from "@/features/analytics/utils/clientsAnalyticsCompute";

export function ClientsAnalyticsPanel({
  data,
  filteredPosts,
  periodLabel,
  isLoading,
}: AnalyticsPanelProps) {
  const { clients } = data;

  const view = useMemo(() => {
    const breakdowns = buildClientBreakdowns(filteredPosts, clients);
    return {
      topClients: buildTopClientsByPosts(breakdowns),
      breakdowns,
    };
  }, [filteredPosts, clients]);

  return (
    <div className="space-y-6">
      <HorizontalBarChart
        title="Top Clients by Posts"
        description={`Post volume per client — ${periodLabel.toLowerCase()}.`}
        data={view.topClients}
        color="var(--chart-1)"
        emptyMessage="No client posts in this period."
      />

      <AnalyticsBreakdownTable
        title="Client Activity Breakdown"
        nameHeader="Client"
        rows={view.breakdowns}
        isLoading={isLoading}
        emptyMessage="No client posts in this period."
      />
    </div>
  );
}
