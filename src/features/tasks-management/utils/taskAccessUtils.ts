import type { TaskTabId } from "@/features/tasks-management/constants/taskTabs";
import type {
  Subtask,
  Task,
} from "@/features/tasks-management/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { isAdminOrManagerRole } from "@/shared/utils/rbac";

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

/**
 * Full oversight edit: admin, team-role manager, or this project's manager_id.
 * Used for tasks and subtasks.
 */
function hasTaskOversightEdit(input: {
  task: Task;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
}): boolean {
  const { task, teamRole, teamMemberId } = input;
  if (isAdminOrManagerRole(teamRole)) return true;
  return Boolean(teamMemberId && task.projects?.manager_id === teamMemberId);
}

/** Full edit: admin, team-role manager, project manager, or raiser. */
export function canEditTaskAccess(input: {
  task: Task;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
}): boolean {
  const { task, teamRole, teamMemberId } = input;
  if (hasTaskOversightEdit({ task, teamRole, teamMemberId })) return true;
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

/** View + chat + raise subtasks: oversight roles, raiser, assignee, deps, PM. */
export function canAccessTask(input: {
  task: Task;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
}): boolean {
  const { task, teamRole, teamMemberId } = input;
  if (!teamMemberId) return false;
  if (isAdminOrManagerRole(teamRole)) return true;
  if (task.projects?.manager_id === teamMemberId) return true;
  if (task.created_by_team_member_id === teamMemberId) return true;
  if (isTaskTeamAssignee(task, teamMemberId)) return true;
  return task.tagged_members.some((member) => member.id === teamMemberId);
}

/** Client portal: any task on this client's SM or Dev projects. */
export function canClientAccessTask(
  task: Task,
  clientId: string | null,
): boolean {
  if (!clientId) return false;
  if (task.projects?.clients?.id === clientId) return true;
  // Fallbacks when project embed is incomplete.
  if (task.client_id === clientId) return true;
  if (task.dependency_client_id === clientId) return true;
  return task.assignees.some((assignee) => assignee.client_id === clientId);
}

/** Anyone who can open the task detail can add a subtask. */
export function canCreateSubtaskAccess(input: {
  task: Task;
  teamRole: TeamMemberRole | null;
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

/** Full edit/delete: admin, team-role manager, parent-task PM, or subtask raiser. */
export function canFullyEditSubtaskAccess(input: {
  subtask: Subtask;
  parentTask: Task;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
  clientId: string | null;
}): boolean {
  if (
    hasTaskOversightEdit({
      task: input.parentTask,
      teamRole: input.teamRole,
      teamMemberId: input.teamMemberId,
    })
  ) {
    return true;
  }
  return isSubtaskRaiser(input.subtask, input.teamMemberId, input.clientId);
}

/** Pencil: full edit (admin/role-manager/PM/raiser) or assignee (status only). */
export function canEditSubtaskAccess(input: {
  subtask: Subtask;
  parentTask: Task;
  teamRole: TeamMemberRole | null;
  teamMemberId: string | null;
  clientId: string | null;
}): boolean {
  return (
    canFullyEditSubtaskAccess(input) ||
    isSubtaskAssignee(input.subtask, input.teamMemberId, input.clientId)
  );
}
