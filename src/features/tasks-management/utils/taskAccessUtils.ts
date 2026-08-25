import type { TaskTabId } from "@/features/tasks-management/constants/taskTabs";
import type {
  Subtask,
  Task,
} from "@/features/tasks-management/types/types";

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
      task.assignees.some(
        (assignee) => assignee.team_member_id === teamMemberId,
      ) ||
      task.assigned_to_team_member_id === teamMemberId ||
      task.tagged_members.some((member) => member.id === teamMemberId),
  );
}

/** Edit pencil: only the teammate who raised the task. */
export function canEditTaskAccess(input: {
  task: Task;
  teamMemberId: string | null;
}): boolean {
  const { task, teamMemberId } = input;
  return Boolean(
    teamMemberId && task.created_by_team_member_id === teamMemberId,
  );
}

function isTaskTeamAssignee(task: Task, teamMemberId: string): boolean {
  if (task.assigned_to_team_member_id === teamMemberId) return true;
  return task.assignees.some(
    (assignee) => assignee.team_member_id === teamMemberId,
  );
}

/** View + chat + raise subtasks: raiser, assignee, deps, PM, admin. */
export function canAccessTask(input: {
  task: Task;
  teamRole: string | null;
  teamMemberId: string | null;
}): boolean {
  const { task, teamRole, teamMemberId } = input;
  if (!teamMemberId) return false;
  if (teamRole === "admin") return true;
  if (task.projects?.manager_id === teamMemberId) return true;
  if (task.created_by_team_member_id === teamMemberId) return true;
  if (isTaskTeamAssignee(task, teamMemberId)) return true;
  return task.tagged_members.some((member) => member.id === teamMemberId);
}

/** Client portal: tasks that include this client as an assignee. */
export function canClientAccessTask(
  task: Task,
  clientId: string | null,
): boolean {
  if (!clientId) return false;
  if (task.client_id === clientId) return true;
  return task.assignees.some((assignee) => assignee.client_id === clientId);
}

/** Anyone who can open the task detail can add a subtask. */
export function canCreateSubtaskAccess(input: {
  task: Task;
  teamRole: string | null;
  teamMemberId: string | null;
  clientId: string | null;
}): boolean {
  if (canAccessTask(input)) return true;
  return canClientAccessTask(input.task, input.clientId);
}

function isSubtaskRaiser(
  subtask: Subtask,
  teamMemberId: string | null,
  clientId: string | null,
): boolean {
  if (teamMemberId && subtask.created_by_team_member_id === teamMemberId) {
    return true;
  }
  if (clientId && subtask.created_by_client_id === clientId) {
    return true;
  }
  return false;
}

function isSubtaskAssignee(
  subtask: Subtask,
  teamMemberId: string | null,
  clientId: string | null,
): boolean {
  if (
    teamMemberId &&
    (subtask.assigned_to_team_member_id === teamMemberId ||
      subtask.assignees.some(
        (assignee) => assignee.team_member_id === teamMemberId,
      ))
  ) {
    return true;
  }
  if (
    clientId &&
    (subtask.assigned_to_client_id === clientId ||
      subtask.assignees.some((assignee) => assignee.client_id === clientId))
  ) {
    return true;
  }
  return false;
}

/** Full edit/delete: only the person who raised the subtask. */
export function canFullyEditSubtaskAccess(input: {
  subtask: Subtask;
  teamMemberId: string | null;
  clientId: string | null;
}): boolean {
  return isSubtaskRaiser(input.subtask, input.teamMemberId, input.clientId);
}

/** Pencil: raiser (full edit) or assignee (status only). */
export function canEditSubtaskAccess(input: {
  subtask: Subtask;
  teamMemberId: string | null;
  clientId: string | null;
}): boolean {
  return (
    canFullyEditSubtaskAccess(input) ||
    isSubtaskAssignee(input.subtask, input.teamMemberId, input.clientId)
  );
}
