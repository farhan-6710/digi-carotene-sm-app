import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchProjectsScoped } from "@/services/projectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useProjectsQuery() {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(
    () => fetchProjectsScoped(teamRole, teamMemberId),
    [teamRole, teamMemberId],
  );

  const {
    data: projects,
    isLoading,
    error,
    setError,
    reload,
  } = useFetch<ProjectListItem[]>(load, []);

  return { projects, isLoading, error, setError, reload };
}
