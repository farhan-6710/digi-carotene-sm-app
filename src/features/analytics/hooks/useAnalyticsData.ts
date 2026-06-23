import { useCallback, useEffect, useState } from "react";

import type { AnalyticsDataset } from "@/features/analytics/types/types";
import { fetchClients } from "@/features/clients-management/utils/clientsRepository";
import { fetchAllPosts } from "@/features/posts-management/utils/postsRepository";
import { fetchProjects } from "@/features/projects-management/utils/projectsRepository";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";

const EMPTY_DATASET: AnalyticsDataset = {
  posts: [],
  clients: [],
  teamMembers: [],
  projects: [],
};

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsDataset>(EMPTY_DATASET);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [posts, clients, teamMembers, projects] = await Promise.all([
        fetchAllPosts(),
        fetchClients(),
        fetchTeamMembers(),
        fetchProjects(),
      ]);

      setData({ posts, clients, teamMembers, projects });
    } catch (err) {
      setData(EMPTY_DATASET);
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
