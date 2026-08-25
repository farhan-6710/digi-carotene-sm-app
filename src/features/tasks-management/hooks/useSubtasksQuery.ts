import { useCallback } from "react";

import type { Subtask } from "@/features/tasks-management/types/types";
import { fetchSubtasksForTask } from "@/services/subtasksService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useSubtasksQuery(parentTaskId: string) {
  const load = useCallback(
    () =>
      parentTaskId
        ? fetchSubtasksForTask(parentTaskId)
        : Promise.resolve([] as Subtask[]),
    [parentTaskId],
  );

  const { data, isLoading, error, setError, reload } = useFetch<Subtask[]>(
    load,
    [],
  );

  return {
    subtasks: data,
    isLoading,
    error,
    setError,
    reload,
  };
}
