import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  Task,
  TaskMessage,
} from "@/features/tasks-management/types/types";
import { canAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { fetchTaskMessages } from "@/services/taskMessagesService";
import { fetchTaskById } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

type TaskDetail = {
  task: Task | null;
  messages: TaskMessage[];
};

const EMPTY: TaskDetail = { task: null, messages: [] };

export function useTaskDetailQuery(taskId: string) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<TaskDetail> => {
    if (!taskId) return EMPTY;

    const task = await fetchTaskById(taskId);
    if (!task) return EMPTY;

    if (!canAccessTask({ task, teamRole, teamMemberId })) {
      return EMPTY;
    }

    const messages = await fetchTaskMessages(taskId);
    return { task, messages };
  }, [taskId, teamMemberId, teamRole]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    task: data.task,
    messages: data.messages,
    isLoading,
    error,
    setError,
    reload,
  };
}
