export const PRODUCTION_PLANNER_PATH = "/team-portal/production-planner";
export const PRODUCTION_PLANNER_CLIENT_PARAM = "client";
export const PRODUCTION_PLANNER_ALL_CLIENTS = "all";

export function buildProductionPlanDetailPath(planId: string): string {
  return `${PRODUCTION_PLANNER_PATH}/${planId}`;
}
