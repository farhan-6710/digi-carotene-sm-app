export const PRODUCTION_PLANNER_PATH = "/team-portal/production-planner";

export function buildProductionPlanDetailPath(planId: string): string {
  return `${PRODUCTION_PLANNER_PATH}/${planId}`;
}
