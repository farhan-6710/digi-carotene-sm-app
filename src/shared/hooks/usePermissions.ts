import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  can as canForRole,
  seesAllProjects as seesAllProjectsForRole,
  type Permission,
} from "@/shared/utils/rbac";

// Binds the centralized RBAC rules to the current user's team role.
// Usage: const { can, seesAllProjects } = usePermissions();
export function usePermissions() {
  const { teamRole } = useAuth();

  return {
    role: teamRole,
    can: (permission: Permission) => canForRole(teamRole, permission),
    seesAllProjects: seesAllProjectsForRole(teamRole),
  };
}
