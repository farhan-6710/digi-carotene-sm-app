export const OTHER_PROJECTS_MANAGEMENT_PATH =
  "/team-portal/other-projects-management";

export function buildOtherProjectDetailPath(projectId: string): string {
  return `${OTHER_PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}
