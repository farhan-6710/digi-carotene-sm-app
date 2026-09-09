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

const TEAM_MEMBER_ROLE_SET = new Set<string>(TEAM_MEMBER_ROLES);

/**
 * Map DB / legacy values to the current role union.
 * Production DBs that have not run migration 071 still store `executive`.
 */
export function normalizeTeamMemberRole(
  role: string | null | undefined,
): TeamMemberRole | null {
  if (!role) return null;
  if (role === "executive") return "sm_executive";
  if (TEAM_MEMBER_ROLE_SET.has(role)) return role as TeamMemberRole;
  return null;
}

export function teamMemberRoleLabel(
  role: string | null | undefined,
): string {
  const normalized = normalizeTeamMemberRole(role);
  if (!normalized) return "Unknown role";
  return TEAM_MEMBER_ROLE_LABELS[normalized];
}

export function teamMemberRoleBadgeClass(
  role: string | null | undefined,
): string {
  const normalized = normalizeTeamMemberRole(role);
  if (!normalized) return "bg-muted text-muted-foreground";
  return TEAM_MEMBER_ROLE_BADGE_CLASS[normalized];
}
