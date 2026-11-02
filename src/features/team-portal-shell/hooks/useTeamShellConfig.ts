import { useMemo } from "react";

import { CRM_BASE_PATH } from "@/features/crm/constants/routes";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { teamBasePath } from "@/features/team-portal-shell/constants/navigation";
import { teamShellConfig } from "@/features/team-portal-shell/constants/shellConfig";
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { ShellSidebarConfig } from "@/shared/types/components";

/** Team sidebar filtered by RBAC (e.g. CRM admin-only; editors hide posts). */
export function useTeamShellConfig(): ShellSidebarConfig {
  const { can } = usePermissions();
  const canReadCrm = can("crm.read");
  const canReadPosts = can("posts.read");
  const canReadTeam = can("team.read");
  const canReadClients = can("clients.read");
  const canReadProjects = can("projects.read");
  const canReadTasks = can("tasks.read");
  const canReadProductionPlans = can("productionPlans.read");

  return useMemo(() => {
    const nav = teamShellConfig.nav
      .map((item) => {
        if (item.to.startsWith(CRM_BASE_PATH) && !canReadCrm) return null;
        if (item.to === `${teamBasePath}/team-management` && !canReadTeam) {
          return null;
        }
        if (
          item.to === `${teamBasePath}/clients-management` &&
          !canReadClients
        ) {
          return null;
        }
        if (item.to === `${teamBasePath}/posts-management` && !canReadPosts) {
          return null;
        }
        if (item.to === `${teamBasePath}/tasks-management` && !canReadTasks) {
          return null;
        }

        if (!item.children) return item;

        const children = item.children.filter((child) => {
          if (child.to === PRODUCTION_PLANNER_PATH) {
            return canReadProductionPlans;
          }
          return canReadProjects;
        });

        if (children.length === 0) return null;
        return { ...item, children };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      ...teamShellConfig,
      nav,
      quickAction: canReadPosts ? teamShellConfig.quickAction : undefined,
    };
  }, [
    canReadClients,
    canReadCrm,
    canReadPosts,
    canReadProductionPlans,
    canReadProjects,
    canReadTasks,
    canReadTeam,
  ]);
}
