export const SHARE_PROJECT_PATH = "/share/project";
export const SHARE_PLAN_PATH = "/share/plan";

export function buildSharedProjectPath(token: string): string {
  return `${SHARE_PROJECT_PATH}/${token}`;
}

export function buildSharedPlanPath(token: string): string {
  return `${SHARE_PLAN_PATH}/${token}`;
}
