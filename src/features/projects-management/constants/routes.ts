export const PROJECTS_MANAGEMENT_PATH = "/admin/projects-management";

export function buildProjectDetailPath(projectId: string): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}
