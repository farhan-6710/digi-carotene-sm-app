import { useEffect, useMemo, useState } from "react";

import { NeedsAttention } from "@/features/dashboard/components/NeedsAttention";
import { usePostsAnalyticsQuery } from "@/features/analytics/hooks/usePostsAnalyticsQuery";
import { fetchClients } from "@/features/clients-management/utils/clientsRepository";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";
import { PostingComparisonChart } from "@/features/dashboard/components/PostingComparisonChart";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import { buildDashboardStatCards } from "@/features/dashboard/utils/dashboardStatsUtils";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { supabase } from "@/shared/lib/supabase";

export function AdminDashboardPage() {
  const { topClients, isLoading: isPostsLoading } = usePostsAnalyticsQuery();

  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [teamMembersCount, setTeamMembersCount] = useState<number | null>(null);
  const [totalPostsCount, setTotalPostsCount] = useState<number | null>(null);
  const [missedPostsCount, setMissedPostsCount] = useState<number | null>(null);
  const [isCountsLoading, setIsCountsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchClients(),
      fetchTeamMembers(),
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "Not posted"),
    ])
      .then(([clients, teamMembers, postsRes, missedRes]) => {
        setClientsCount(clients.length);
        setTeamMembersCount(teamMembers.length);
        setTotalPostsCount(postsRes.count);
        setMissedPostsCount(missedRes.count);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard counts:", err);
      })
      .finally(() => {
        setIsCountsLoading(false);
      });
  }, []);

  const statCards = useMemo(
    () =>
      buildDashboardStatCards({
        clientsCount,
        teamMembersCount,
        totalPostsCount,
        missedPostsCount,
      }),
    [clientsCount, teamMembersCount, totalPostsCount, missedPostsCount],
  );

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Dashboard"
        description="Real-time operations, team workload, and publishing performance."
      />

      <StatsCards cards={statCards} isLoading={isCountsLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PostingComparisonChart />
          <PostsTopClientsTable clients={topClients} isLoading={isPostsLoading} />
        </div>

        <div className="lg:col-span-1">
          <NeedsAttention />
        </div>
      </div>
    </section>
  );
}
