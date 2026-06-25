import { useCallback, useEffect, useState } from "react";

import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";
import { canAccessApprovalsNav } from "@/features/post-approvals/utils/postApprovalRules";
import {
  countPendingApprovalsForReviewer,
  managesAnyProject,
} from "@/features/post-approvals/utils/postApprovalsRepository";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

type UsePendingApprovalsCountOptions = {
  teamMemberId: string | null;
  teamRole: TeamMemberRole | null;
};

export function usePendingApprovalsCount({
  teamMemberId,
  teamRole,
}: UsePendingApprovalsCountOptions) {
  const [count, setCount] = useState(0);
  const [canReview, setCanReview] = useState(false);

  const reload = useCallback(async () => {
    if (!teamMemberId || !teamRole) {
      setCount(0);
      setCanReview(false);
      return;
    }

    try {
      const managesProject = await managesAnyProject(teamMemberId);
      const hasAccess = canAccessApprovalsNav(teamRole, managesProject);
      setCanReview(hasAccess);

      if (!hasAccess) {
        setCount(0);
        return;
      }

      const nextCount = await countPendingApprovalsForReviewer(
        teamMemberId,
        teamRole,
      );
      setCount(nextCount);
    } catch {
      setCount(0);
      setCanReview(false);
    }
  }, [teamMemberId, teamRole]);

  useEffect(() => {
    void reload();

    const handleUpdated = () => {
      void reload();
    };

    window.addEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);
    window.addEventListener("focus", handleUpdated);

    return () => {
      window.removeEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);
      window.removeEventListener("focus", handleUpdated);
    };
  }, [reload]);

  return { count, canReview, reload };
}
