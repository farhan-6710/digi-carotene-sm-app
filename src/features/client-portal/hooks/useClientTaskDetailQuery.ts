import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  Task,
  TaskMemberRef,
  TaskMessage,
} from "@/features/tasks-management/types/types";
import { canClientAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { fetchTaskMessages } from "@/services/taskMessagesService";
import { fetchTaskById } from "@/services/tasksService";
import { fetchAdminTeamMembers } from "@/services/teamMembersService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientTaskDetail = {
  task: Task | null;
  messages: TaskMessage[];
  adminMembers: TaskMemberRef[];
};

const EMPTY: ClientTaskDetail = { task: null, messages: [], adminMembers: [] };

export function useClientTaskDetailQuery(taskId: string) {
  const { clientId } = useAuth();

  const load = useCallback(async (): Promise<ClientTaskDetail> => {
    if (!taskId || !clientId) return EMPTY;

    const task = await fetchTaskById(taskId);
    if (!task || !canClientAccessTask(task, clientId)) return EMPTY;

    const [messages, adminMembers] = await Promise.all([
      fetchTaskMessages(taskId),
      fetchAdminTeamMembers(),
    ]);
    return { task, messages, adminMembers };
  }, [clientId, taskId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    task: data.task,
    messages: data.messages,
    adminMembers: data.adminMembers,
    isLoading,
    error,
    setError,
    reload,
  };
}
