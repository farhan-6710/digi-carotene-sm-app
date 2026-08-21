import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  Task,
  TaskMessage,
} from "@/features/tasks-management/types/types";
import { canClientAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { fetchTaskMessages } from "@/services/taskMessagesService";
import { fetchTaskById } from "@/services/tasksService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientTaskDetail = {
  task: Task | null;
  messages: TaskMessage[];
};

const EMPTY: ClientTaskDetail = { task: null, messages: [] };

export function useClientTaskDetailQuery(taskId: string) {
  const { clientId } = useAuth();

  const load = useCallback(async (): Promise<ClientTaskDetail> => {
    if (!taskId || !clientId) return EMPTY;

    const task = await fetchTaskById(taskId);
    if (!task || !canClientAccessTask(task, clientId)) return EMPTY;

    const messages = await fetchTaskMessages(taskId);
    return { task, messages };
  }, [clientId, taskId]);

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
