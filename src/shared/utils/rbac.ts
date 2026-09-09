import {
  normalizeTeamMemberRole,
  type TeamMemberRole,
} from "@/features/team-management/constants/teamMemberRoles";

// Centralized, frontend-only RBAC. Permissions are derived from the
// logged-in user's `team_members.team_role`. Add a new role or resource here and
// the whole app stays in sync — never sprinkle `role === "admin"` checks
// around components.
//
// Override rule: wherever an SM executive (or an executive-typical assignee such as
// shoot incharge) can perform an action, `admin` and `manager` must be able to
// as well. Use `isAdminOrManagerRole` for that inheritance.

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
  sm_executive: ["posts", "tasks"],
  editor: ["posts", "productionPlans"],
};

function resolveRole(role: TeamMemberRole | string | null): TeamMemberRole | null {
  return normalizeTeamMemberRole(role);
}

/** Admin/manager inherit control of SM-executive-controlled actions. */
export function isAdminOrManagerRole(
  role: TeamMemberRole | string | null,
): boolean {
  const resolved = resolveRole(role);
  return resolved === "admin" || resolved === "manager";
}

export function can(
  role: TeamMemberRole | string | null,
  permission: Permission,
): boolean {
  const resolved = resolveRole(role);
  if (!resolved) {
    return false;
  }

  const resource = permission.split(".")[0] as RbacResource;
  const resources = ROLE_RESOURCES[resolved];
  return resources?.includes(resource) ?? false;
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
    sm_executive: "assigned",
    editor: "assigned",
  };

export function projectDataScopeForRole(
  role: TeamMemberRole | string | null,
): ProjectDataScope {
  const resolved = resolveRole(role);
  if (!resolved) {
    return "assigned";
  }
  return PROJECT_DATA_SCOPE_BY_ROLE[resolved] ?? "assigned";
}

export function seesAllProjects(role: TeamMemberRole | string | null): boolean {
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
  sm_executive: "assigned",
  editor: "assigned",
};

export function productionPlanDataScopeForRole(
  role: TeamMemberRole | string | null,
): ProductionPlanDataScope {
  const resolved = resolveRole(role);
  if (!resolved) {
    return "assigned";
  }
  return PRODUCTION_PLAN_DATA_SCOPE_BY_ROLE[resolved] ?? "assigned";
}

export function seesAllProductionPlans(
  role: TeamMemberRole | string | null,
): boolean {
  return productionPlanDataScopeForRole(role) === "all";
}
