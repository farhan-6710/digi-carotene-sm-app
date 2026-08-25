import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Subtask, Task } from "@/features/tasks-management/types/types";
import { canAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { getSubtaskById } from "@/services/subtasksService";
import { fetchTaskById } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

type SubtaskDetail = {
  parentTask: Task | null;
  subtask: Subtask | null;
};

const EMPTY: SubtaskDetail = { parentTask: null, subtask: null };

export function useSubtaskDetailQuery(taskId: string, subtaskId: string) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<SubtaskDetail> => {
    if (!taskId || !subtaskId) return EMPTY;

    const parentTask = await fetchTaskById(taskId);
    if (!parentTask) return EMPTY;
    if (!canAccessTask({ task: parentTask, teamRole, teamMemberId })) {
      return EMPTY;
    }

    const subtask = await getSubtaskById(subtaskId);
    if (subtask.parent_task_id !== parentTask.id) return EMPTY;

    return { parentTask, subtask };
  }, [subtaskId, taskId, teamMemberId, teamRole]);

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
