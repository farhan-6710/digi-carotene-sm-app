import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

// Centralized, frontend-only RBAC. Permissions are derived from the
// logged-in user's `team_members.team_role`. Add a new role or resource here and
// the whole app stays in sync — never sprinkle `role === "admin"` checks
// around components.

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

// Resources each role has full CRUD on. Extend with finer-grained
// `Permission[]` lists if a role ever needs partial access to a resource.
const ROLE_RESOURCES: Record<TeamMemberRole, RbacResource[]> = {
  admin: [
    "team",
    "clients",
    "projects",
    "posts",
    "productionPlans",
    "tasks",
    "leads",
    "crm",
  ],
  manager: ["clients", "projects", "posts", "tasks"],
  executive: ["posts", "tasks"],
};

export function can(role: TeamMemberRole | null, permission: Permission): boolean {
  if (!role) {
    return false;
  }

  const resource = permission.split(".")[0] as RbacResource;
  return ROLE_RESOURCES[role].includes(resource);
}

// ─── Project / post list scoping ─────────────────────────────────────────────
// Controls which projects (and thus which posts) a role sees in team portal
// lists. Flip a role to "all" here to restore unfiltered lists — one-line change.

/** `all` = every project; `assigned` = manager_id OR active project_team_members. */
export type ProjectDataScope = "all" | "assigned";

export const PROJECT_DATA_SCOPE_BY_ROLE: Record<TeamMemberRole, ProjectDataScope> =
  {
    admin: "all",
    manager: "assigned",
    executive: "assigned",
  };

export function projectDataScopeForRole(
  role: TeamMemberRole | null,
): ProjectDataScope {
  if (!role) {
    return "assigned";
  }
  return PROJECT_DATA_SCOPE_BY_ROLE[role];
}

export function seesAllProjects(role: TeamMemberRole | null): boolean {
  return projectDataScopeForRole(role) === "all";
}

/** `all` = every plan; `assigned` = manager, shoot incharge, or active plan team row. */
export type ProductionPlanDataScope = "all" | "assigned";

export const PRODUCTION_PLAN_DATA_SCOPE_BY_ROLE: Record<
  TeamMemberRole,
  ProductionPlanDataScope
> = {
  admin: "all",
  manager: "assigned",
  executive: "assigned",
};

export function productionPlanDataScopeForRole(
  role: TeamMemberRole | null,
): ProductionPlanDataScope {
  if (!role) {
    return "assigned";
  }
  return PRODUCTION_PLAN_DATA_SCOPE_BY_ROLE[role];
}

export function seesAllProductionPlans(role: TeamMemberRole | null): boolean {
  return productionPlanDataScopeForRole(role) === "all";
}
