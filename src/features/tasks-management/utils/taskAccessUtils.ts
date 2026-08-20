import type { TaskTabId } from "@/features/tasks-management/constants/taskTabs";
import type { Task } from "@/features/tasks-management/types/types";

export function filterTasksByTab(
  tasks: Task[],
  tab: TaskTabId,
  teamMemberId: string | null,
): Task[] {
  if (!teamMemberId || tab === "all") return tasks;

  if (tab === "raised_by_me") {
    return tasks.filter(
      (task) => task.created_by_team_member_id === teamMemberId,
    );
  }

  return tasks.filter(
    (task) =>
      task.assigned_to_team_member_id === teamMemberId ||
      task.tagged_members.some((member) => member.id === teamMemberId),
  );
}

export function canEditTaskAccess(input: {
  task: Task;
  teamRole: string | null;
  teamMemberId: string | null;
}): boolean {
  const { task, teamRole, teamMemberId } = input;
  if (!teamMemberId) return false;
  if (teamRole === "admin") return true;
  if (task.projects?.manager_id === teamMemberId) return true;
  if (task.created_by_team_member_id === teamMemberId) return true;
  if (task.assigned_to_team_member_id === teamMemberId) return true;
  return false;
}

/** View + chat: raiser, assignee, tagged, project manager, admin. */
export function canAccessTask(input: {
  task: Task;
  teamRole: string | null;
  teamMemberId: string | null;
}): boolean {
  if (canEditTaskAccess(input)) return true;
  const { task, teamMemberId } = input;
  if (!teamMemberId) return false;
  return task.tagged_members.some((member) => member.id === teamMemberId);
}
