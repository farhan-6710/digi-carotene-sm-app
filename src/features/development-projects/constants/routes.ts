export const DEV_PROJECTS_MANAGEMENT_PATH =
  "/team-portal/dev-projects-management";

export function buildDevProjectDetailPath(projectId: string): string {
  return `${DEV_PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}
