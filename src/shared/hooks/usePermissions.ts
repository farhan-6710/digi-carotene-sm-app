import { useAuth } from "@/features/auth/providers/AuthProvider";
import { can as canForRole, type Permission } from "@/shared/utils/rbac";

// Binds the centralized RBAC rules to the current user's team role.
// Usage in components: const { can } = usePermissions(); can("team.create").
export function usePermissions() {
  const { adminTeamRole } = useAuth();

  return {
    role: adminTeamRole,
    can: (permission: Permission) => canForRole(adminTeamRole, permission),
  };
}
