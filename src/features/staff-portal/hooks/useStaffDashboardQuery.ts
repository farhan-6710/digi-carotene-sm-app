import { useCallback, useEffect, useMemo, useState } from "react";

import { buildAdminStatCards } from "@/features/admin-dashboard/utils/adminStatsUtils";
import { usePostsAnalyticsQuery } from "@/features/analytics/hooks/usePostsAnalyticsQuery";
import { fetchClients } from "@/features/clients-management/utils/clientsRepository";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";
import { supabase } from "@/shared/lib/supabase";

export function useAdminDashboardQuery() {
  const {
    topClients,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsAnalyticsQuery();

  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [teamMembersCount, setTeamMembersCount] = useState<number | null>(null);
  const [totalPostsCount, setTotalPostsCount] = useState<number | null>(null);
  const [missedPostsCount, setMissedPostsCount] = useState<number | null>(null);
  const [isCountsLoading, setIsCountsLoading] = useState(true);
  const [countsError, setCountsError] = useState<string | null>(null);

  const reloadCounts = useCallback(async () => {
    setIsCountsLoading(true);
    setCountsError(null);

    try {
      const [clients, teamMembers, postsRes, missedRes] = await Promise.all([
        fetchClients(),
        fetchTeamMembers(),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("status", "Not posted"),
      ]);

      setClientsCount(clients.length);
      setTeamMembersCount(teamMembers.length);
      setTotalPostsCount(postsRes.count);
      setMissedPostsCount(missedRes.count);
    } catch (err) {
      setCountsError(
        err instanceof Error ? err.message : "Failed to load dashboard counts.",
      );
    } finally {
      setIsCountsLoading(false);
    }
  }, []);

  useEffect(() => {
    //eslint-disable-next-line
    void reloadCounts();
  }, [reloadCounts]);

  const statCards = useMemo(
    () =>
      buildAdminStatCards({
        clientsCount,
        teamMembersCount,
        totalPostsCount,
        missedPostsCount,
      }),
    [clientsCount, teamMembersCount, totalPostsCount, missedPostsCount],
  );

  return {
    statCards,
    topClients,
    isStatsLoading: isCountsLoading,
    isPostsLoading,
    error: countsError ?? postsError,
    reloadCounts,
  };
}
