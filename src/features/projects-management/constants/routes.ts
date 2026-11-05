export const PROJECTS_MANAGEMENT_PATH = "/team-portal/projects-management";

export { PROJECT_COMMITMENTS_PATH } from "@/features/projects-management/constants/projectCommitments";
export { OTHER_PROJECTS_MANAGEMENT_PATH } from "@/features/other-projects/constants/routes";

export function buildProjectDetailPath(projectId: string): string {
  return `${PROJECTS_MANAGEMENT_PATH}/${projectId}`;
}
