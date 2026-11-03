import {
  normalizeTeamMemberRole,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";

/**
 * Team portal RBAC — frontend only (from `team_members.team_role`).
 *
 * HOW TO CHANGE ACCESS
 * 1. Find the role in ROLE_ACCESS below.
 * 2. Set each area to "none" | "read" | "full".
 * 3. Flip seeAll* / socialsOnly if needed.
 *
 * "none" = no access
 * "read" = view only
 * "full" = create + read + update + delete
 *
 * UI should call `can(role, "posts.update")` (via usePermissions) — not `role === "admin"`.
 */

export type RbacResource =
  | "team"
  | "clients"
  | "projects"
  | "posts"
  | "productionPlans"
  | "tasks"
  | "leads"
  | "crm";

export type RbacAction = "create" | "read" | "update" | "delete";
export type Permission = `${RbacResource}.${RbacAction}`;
export type AccessLevel = "none" | "read" | "full";
export type ProjectDataScope = "all" | "assigned";
export type ProductionPlanDataScope = "all" | "assigned";

type RoleAccess = Record<RbacResource, AccessLevel> & {
  /** true = whole agency list; false = only assigned rows */
  seeAllProjects: boolean;
  seeAllProductionPlans: boolean;
  /** SM executive: edit project social URLs without full project edit */
  socialsOnly: boolean;
};

/** ─── Edit role access here (single source of truth) ─── */
const ROLE_ACCESS: Record<TeamMemberRole, RoleAccess> = {
  admin: {
    team: "full",
    clients: "full",
    projects: "full",
    posts: "full",
    productionPlans: "full",
    tasks: "full",
    leads: "full",
    crm: "full",
    seeAllProjects: true,
    seeAllProductionPlans: true,
    socialsOnly: false,
  },
  manager: {
    team: "none",
    clients: "full",
    projects: "full",
    posts: "full",
    productionPlans: "read",
    tasks: "full",
    leads: "none",
    crm: "none",
    seeAllProjects: false,
    seeAllProductionPlans: false,
    socialsOnly: false,
  },
  sm_executive: {
    team: "none",
    clients: "none",
    // View assigned projects only (manager or active team seat) — not agency-wide.
    projects: "read",
    posts: "full",
    productionPlans: "none",
    tasks: "full",
    leads: "none",
    crm: "none",
    seeAllProjects: false,
    seeAllProductionPlans: false,
    socialsOnly: true,
  },
  editor: {
    team: "none",
    clients: "none",
    projects: "read",
    posts: "read",
    productionPlans: "none",
    tasks: "none",
    leads: "none",
    crm: "none",
    seeAllProjects: false,
    seeAllProductionPlans: false,
    socialsOnly: false,
  },
};

function accessFor(role: TeamMemberRole | string | null): RoleAccess | null {
  const resolved = normalizeTeamMemberRole(role);
  return resolved ? ROLE_ACCESS[resolved] : null;
}

function levelAllows(level: AccessLevel, action: RbacAction): boolean {
  if (level === "full") return true;
  if (level === "read") return action === "read";
  return false;
}

/** Admin or manager (shared override for SM-executive-style actions). */
export function isAdminOrManagerRole(
  role: TeamMemberRole | string | null,
): boolean {
  const resolved = normalizeTeamMemberRole(role);
  return resolved === "admin" || resolved === "manager";
}

/** Example: can(role, "posts.update") */
export function can(
  role: TeamMemberRole | string | null,
  permission: Permission,
): boolean {
  const access = accessFor(role);
  if (!access) return false;

  const [resource, action] = permission.split(".") as [RbacResource, RbacAction];
  return levelAllows(access[resource], action);
}

/** Full project edit (not socials-only). */
export function canFullyEditProject(
  role: TeamMemberRole | string | null,
): boolean {
  return can(role, "projects.update");
}

/** Full project edit, or SM executive socials-only. */
export function canEditProjectSocials(
  role: TeamMemberRole | string | null,
): boolean {
  const access = accessFor(role);
  if (!access) return false;
  return levelAllows(access.projects, "update") || access.socialsOnly;
}

export function projectDataScopeForRole(
  role: TeamMemberRole | string | null,
): ProjectDataScope {
  return accessFor(role)?.seeAllProjects ? "all" : "assigned";
}

export function seesAllProjects(role: TeamMemberRole | string | null): boolean {
  return projectDataScopeForRole(role) === "all";
}

export function productionPlanDataScopeForRole(
  role: TeamMemberRole | string | null,
): ProductionPlanDataScope {
  return accessFor(role)?.seeAllProductionPlans ? "all" : "assigned";
}

export function seesAllProductionPlans(
  role: TeamMemberRole | string | null,
): boolean {
  return productionPlanDataScopeForRole(role) === "all";
}

/** Kept for docs / callers that map role → scope directly. */
export const PROJECT_DATA_SCOPE_BY_ROLE: Record<TeamMemberRole, ProjectDataScope> =
  {
    admin: projectDataScopeForRole("admin"),
    manager: projectDataScopeForRole("manager"),
    sm_executive: projectDataScopeForRole("sm_executive"),
    editor: projectDataScopeForRole("editor"),
  };

export const PRODUCTION_PLAN_DATA_SCOPE_BY_ROLE: Record<
  TeamMemberRole,
  ProductionPlanDataScope
> = {
  admin: productionPlanDataScopeForRole("admin"),
  manager: productionPlanDataScopeForRole("manager"),
  sm_executive: productionPlanDataScopeForRole("sm_executive"),
  editor: productionPlanDataScopeForRole("editor"),
};
