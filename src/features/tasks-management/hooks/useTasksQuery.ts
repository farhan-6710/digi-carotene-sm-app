import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Task } from "@/features/tasks-management/types/types";
import { fetchTasksForMember } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useTasksQuery() {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(
    () => fetchTasksForMember(teamRole, teamMemberId),
    [teamRole, teamMemberId],
  );

  const { data, isLoading, error, setError, reload } = useFetch<Task[]>(
    load,
    [],
  );

  return {
    tasks: data,
    isLoading,
    error,
    setError,
    reload,
  };
}
