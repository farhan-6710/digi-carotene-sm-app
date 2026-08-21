import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  Task,
  TaskMemberRef,
  TaskMessage,
} from "@/features/tasks-management/types/types";
import { canAccessTask } from "@/features/tasks-management/utils/taskAccessUtils";
import { fetchTaskMessages } from "@/services/taskMessagesService";
import { fetchTaskById } from "@/services/tasksService";
import { fetchAdminTeamMembers } from "@/services/teamMembersService";
import { useFetch } from "@/shared/hooks/useFetch";

type TaskDetail = {
  task: Task | null;
  messages: TaskMessage[];
  adminMembers: TaskMemberRef[];
};

const EMPTY: TaskDetail = { task: null, messages: [], adminMembers: [] };

export function useTaskDetailQuery(taskId: string) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<TaskDetail> => {
    if (!taskId) return EMPTY;

    const task = await fetchTaskById(taskId);
    if (!task) return EMPTY;

    if (!canAccessTask({ task, teamRole, teamMemberId })) {
      return EMPTY;
    }

    const [messages, adminMembers] = await Promise.all([
      fetchTaskMessages(taskId),
      fetchAdminTeamMembers(),
    ]);

    return { task, messages, adminMembers };
  }, [taskId, teamMemberId, teamRole]);

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
