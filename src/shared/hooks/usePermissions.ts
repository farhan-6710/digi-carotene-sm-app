import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  can as canForRole,
  canEditProjectSocials as canEditProjectSocialsForRole,
  canFullyEditProject as canFullyEditProjectForRole,
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
    canFullyEditProject: canFullyEditProjectForRole(teamRole),
    canEditProjectSocials: canEditProjectSocialsForRole(teamRole),
    seesAllProjects: seesAllProjectsForRole(teamRole),
  };
}
