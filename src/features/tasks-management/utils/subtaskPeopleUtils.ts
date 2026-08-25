import type { Task } from "@/features/tasks-management/types/types";

/**
 * People who can be assigned a subtask: everyone already on the parent task
 * (raiser, assignees, dependencies, project manager, task clients).
 */
export function getTaskSubtaskAssigneeMemberIds(task: Task): string[] {
  const ids = new Set<string>();

  if (task.created_by_team_member_id) {
    ids.add(task.created_by_team_member_id);
  }
  if (task.assigned_to_team_member_id) {
    ids.add(task.assigned_to_team_member_id);
  }
  if (task.projects?.manager_id) {
    ids.add(task.projects.manager_id);
  }
  for (const member of task.tagged_members) {
    ids.add(member.id);
  }
  for (const assignee of task.assignees) {
    if (assignee.team_member_id) ids.add(assignee.team_member_id);
  }

  return [...ids];
}

/** Client ids that may receive a subtask. */
export function getTaskSubtaskAssigneeClientIds(task: Task): string[] {
  const ids = new Set<string>();
  if (task.client_id) ids.add(task.client_id);
  if (task.dependency_client_id) ids.add(task.dependency_client_id);
  for (const assignee of task.assignees) {
    if (assignee.client_id) ids.add(assignee.client_id);
  }
  return [...ids];
}
