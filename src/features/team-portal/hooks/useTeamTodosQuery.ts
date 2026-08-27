import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { TeamTodo } from "@/features/team-portal/types/types";
import { fetchTeamTodosForMember } from "@/services/teamTodosService";
import { useFetch } from "@/shared/hooks/useFetch";

const EMPTY: TeamTodo[] = [];

export function useTeamTodosQuery() {
  const { teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<TeamTodo[]> => {
    if (!teamMemberId) return EMPTY;
    return fetchTeamTodosForMember(teamMemberId);
  }, [teamMemberId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    todos: data,
    isLoading,
    error,
    setError,
    reload,
    teamMemberId,
  };
}
