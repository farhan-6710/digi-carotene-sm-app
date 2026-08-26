export const PROJECTS_MANAGEMENT_PATH = "/team-portal/projects-management";
export const OTHER_PROJECTS_MANAGEMENT_PATH =
  "/team-portal/other-projects-management";

export function buildProjectDetailPath(projectId: string): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}
