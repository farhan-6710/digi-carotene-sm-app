import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

// Centralized, frontend-only RBAC. Permissions are derived from the
// logged-in user's `team_members.team_role`. Add a new role or resource here and
// the whole app stays in sync — never sprinkle `role === "admin"` checks
// around components.

export type RbacResource = "team" | "clients" | "projects" | "posts";
export type RbacAction = "create" | "read" | "update" | "delete";
export type Permission = `${RbacResource}.${RbacAction}`;

// Resources each role has full CRUD on. Extend with finer-grained
// `Permission[]` lists if a role ever needs partial access to a resource.
const ROLE_RESOURCES: Record<TeamMemberRole, RbacResource[]> = {
  admin: ["team", "clients", "projects", "posts"],
  manager: ["clients", "projects", "posts"],
  executive: ["posts"],
};

export function can(role: TeamMemberRole | null, permission: Permission): boolean {
  if (!role) {
    return false;
  }

  const resource = permission.split(".")[0] as RbacResource;
  return ROLE_RESOURCES[role].includes(resource);
}
