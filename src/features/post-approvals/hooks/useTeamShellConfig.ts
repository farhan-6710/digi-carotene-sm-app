import { useCallback, useEffect, useMemo, useState } from "react";

import { canAccessApprovalsNav } from "@/features/post-approvals/utils/postApprovalRules";
import { managesAnyProject } from "@/features/post-approvals/utils/postApprovalsRepository";
import {
  approvalsNavItem,
  primaryNav,
} from "@/features/team-portal-shell/constants/navigation";
import { teamShellConfig } from "@/features/team-portal-shell/constants/shellConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ShellSidebarConfig } from "@/shared/types/components";

export function useTeamShellConfig(): ShellSidebarConfig {
  const { teamRole, teamMemberId } = useAuth();
  const [managesProject, setManagesProject] = useState(false);

  const loadReviewerAccess = useCallback(async () => {
    if (!teamMemberId) {
      setManagesProject(false);
      return;
    }

    try {
      setManagesProject(await managesAnyProject(teamMemberId));
    } catch {
      setManagesProject(false);
    }
  }, [teamMemberId]);

  useEffect(() => {
    void loadReviewerAccess();
  }, [loadReviewerAccess]);

  return useMemo(() => {
    const showApprovals = canAccessApprovalsNav(teamRole, managesProject);
    const nav = showApprovals
      ? [
          ...primaryNav.slice(0, 5),
          approvalsNavItem,
          ...primaryNav.slice(5),
        ]
      : primaryNav;

    return {
      ...teamShellConfig,
      nav,
    };
  }, [managesProject, teamRole]);
}
