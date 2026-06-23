import { useMemo } from "react";

import { AnalyticsBreakdownTable } from "@/features/analytics/components/AnalyticsBreakdownTable";
import { HorizontalBarChart } from "@/features/analytics/components/HorizontalBarChart";
import type { AnalyticsPanelProps } from "@/features/analytics/types/components";
import {
  buildClientBreakdowns,
  buildClientStatCards,
  buildTopClientsByPosts,
} from "@/features/analytics/utils/clientsAnalyticsCompute";
import { StatsCards } from "@/shared/components/StatsCards";

export function ClientsAnalyticsPanel({ data, isLoading }: AnalyticsPanelProps) {
  const { posts, clients } = data;

  const view = useMemo(() => {
    const breakdowns = buildClientBreakdowns(posts, clients);
    return {
      stats: buildClientStatCards(posts, clients),
      topClients: buildTopClientsByPosts(breakdowns),
      breakdowns,
    };
  }, [posts, clients]);

  return (
    <div className="space-y-6">
      <StatsCards cards={view.stats} isLoading={isLoading} />

      <HorizontalBarChart
        title="Top Clients by Posts"
        description="All-time post volume per client."
        data={view.topClients}
        color="var(--chart-1)"
        emptyMessage="No client posts yet."
      />

      <AnalyticsBreakdownTable
        title="Client Activity Breakdown"
        nameHeader="Client"
        rows={view.breakdowns}
        isLoading={isLoading}
        emptyMessage="No client posts yet."
      />
    </div>
  );
}
