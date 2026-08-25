import { useMemo } from "react";

import { CRM_BASE_PATH } from "@/features/crm/constants/routes";
import { teamShellConfig } from "@/features/team-portal-shell/constants/shellConfig";
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { ShellSidebarConfig } from "@/shared/types/components";

/** Team sidebar filtered by RBAC (e.g. CRM is admin-only). */
export function useTeamShellConfig(): ShellSidebarConfig {
  const { can } = usePermissions();
  const canReadCrm = can("crm.read");

  return useMemo(() => {
    const nav = teamShellConfig.nav.filter((item) => {
      if (item.to.startsWith(CRM_BASE_PATH)) {
        return canReadCrm;
      }
      return true;
    });

    return {
      ...teamShellConfig,
      nav,
    };
  }, [canReadCrm]);
}
