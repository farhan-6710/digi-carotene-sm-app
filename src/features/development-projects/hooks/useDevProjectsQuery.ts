import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { DevProjectListItem } from "@/features/development-projects/types/types";
import { fetchDevProjectsScoped } from "@/services/devProjectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useDevProjectsQuery() {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(
    () => fetchDevProjectsScoped(teamRole, teamMemberId),
    [teamRole, teamMemberId],
  );

  const { data, isLoading, error, setError, reload } = useFetch(
    load,
    [] as DevProjectListItem[],
  );

  return { projects: data, isLoading, error, setError, reload };
}
