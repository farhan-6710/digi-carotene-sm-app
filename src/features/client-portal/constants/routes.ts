export const CLIENT_PROJECTS_PATH = "/client-portal/projects";
export const CLIENT_PRODUCTION_PLANNER_PATH =
  "/client-portal/production-planner";

export function buildClientProjectDetailPath(projectId: string): string {
  return `${CLIENT_PROJECTS_PATH}/${projectId}`;
}

export function buildClientProductionPlanDetailPath(planId: string): string {
  return `${CLIENT_PRODUCTION_PLANNER_PATH}/${planId}`;
}
