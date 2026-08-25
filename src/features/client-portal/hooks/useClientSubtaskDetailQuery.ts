import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Subtask, Task } from "@/features/tasks-management/types/types";
import { canClientAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { getSubtaskById } from "@/services/subtasksService";
import { fetchTaskById } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientSubtaskDetail = {
  parentTask: Task | null;
  subtask: Subtask | null;
};

const EMPTY: ClientSubtaskDetail = { parentTask: null, subtask: null };

export function useClientSubtaskDetailQuery(
  taskId: string,
  subtaskId: string,
) {
  const { clientId } = useAuth();

  const load = useCallback(async (): Promise<ClientSubtaskDetail> => {
    if (!taskId || !subtaskId || !clientId) return EMPTY;

    const parentTask = await fetchTaskById(taskId);
    if (!parentTask || !canClientAccessTask(parentTask, clientId)) {
      return EMPTY;
    }

    const subtask = await getSubtaskById(subtaskId);
    if (subtask.parent_task_id !== parentTask.id) return EMPTY;

    return { parentTask, subtask };
  }, [clientId, subtaskId, taskId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    parentTask: data.parentTask,
    subtask: data.subtask,
    isLoading,
    error,
    setError,
    reload,
  };
}
