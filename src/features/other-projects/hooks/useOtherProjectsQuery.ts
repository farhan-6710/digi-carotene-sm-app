import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import { fetchOtherProjectsScoped } from "@/services/otherProjectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useOtherProjectsQuery() {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(
    () => fetchOtherProjectsScoped(teamRole, teamMemberId),
    [teamRole, teamMemberId],
  );

  const { data, isLoading, error, setError, reload } = useFetch(
    load,
    [] as OtherProjectListItem[],
  );

  return { projects: data, isLoading, error, setError, reload };
}
