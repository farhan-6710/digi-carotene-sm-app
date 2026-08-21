import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Task } from "@/features/tasks-management/types/types";
import { fetchTasksForClient } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useClientTasksQuery() {
  const { clientId } = useAuth();

  const load = useCallback(
    () => fetchTasksForClient(clientId),
    [clientId],
  );

  const { data, isLoading, error, setError, reload } = useFetch(load, [] as Task[]);

  return {
    tasks: data,
    isLoading,
    error,
    setError,
    reload,
  };
}
