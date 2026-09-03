import {
  getProjectAssociatedMemberIds,
  getProjectClientId,
  type TaskProjectPeopleSource,
} from "@/features/tasks-management/utils/taskProjectPeopleUtils";

/**
 * Same assignable people as the task dialog after a project is selected:
 * project manager + active project teammates + project client.
 */
export function getSubtaskAssigneeScopeFromProject(
  project: TaskProjectPeopleSource | null,
): { memberIds: string[]; clientIds: string[] } {
  if (!project) {
    return { memberIds: [], clientIds: [] };
  }

  const clientId = getProjectClientId(project);
  return {
    memberIds: getProjectAssociatedMemberIds(project),
    clientIds: clientId ? [clientId] : [],
  };
}
