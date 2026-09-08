export const TEAM_MEMBER_ROLES = [
  "sm_executive",
  "editor",
  "manager",
  "admin",
] as const;

export type TeamMemberRole = (typeof TEAM_MEMBER_ROLES)[number];

export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  sm_executive: "SM Executive",
  editor: "Editor/Designer",
  manager: "Manager",
  admin: "Admin",
};

export const TEAM_MEMBER_ROLE_BADGE_CLASS: Record<TeamMemberRole, string> = {
  sm_executive: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  editor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  manager: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  admin: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export const DEFAULT_TEAM_MEMBER_ROLE: TeamMemberRole = "sm_executive";

/** Roles eligible to be assigned as a project manager. */
export const PROJECT_MANAGER_ROLES = ["manager", "admin"] as const;

export type ProjectManagerRole = (typeof PROJECT_MANAGER_ROLES)[number];

export function isProjectManagerRole(
  role: TeamMemberRole,
): role is ProjectManagerRole {
  return role === "manager" || role === "admin";
}
