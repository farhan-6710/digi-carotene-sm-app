import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { canAccessApprovalsSection } from "@/features/post-approvals/utils/postApprovalRules";
import { TeamReviewerAccessContext } from "@/features/post-approvals/providers/teamReviewerAccessContext";
import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";
import {
  countPendingApprovalsForReviewer,
  managesAnyProject,
} from "@/services/postApprovalsService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function TeamReviewerAccessProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { teamMemberId, teamRole } = useAuth();
  const [managesProject, setManagesProject] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const reload = useCallback(async () => {
    if (!teamMemberId || !teamRole) {
      setManagesProject(false);
      setCanReview(false);
      setPendingCount(0);
      return;
    }

    try {
      const manages = await managesAnyProject(teamMemberId);
      const hasAccess = canAccessApprovalsSection(teamRole, manages);

      setManagesProject(manages);
      setCanReview(hasAccess);

      if (!hasAccess) {
        setPendingCount(0);
        return;
      }

      setPendingCount(
        await countPendingApprovalsForReviewer(teamMemberId, teamRole),
      );
    } catch {
      setManagesProject(false);
      setCanReview(false);
      setPendingCount(0);
    }
  }, [teamMemberId, teamRole]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();

    const handleUpdated = () => {
      void reload();
    };

    window.addEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);

    return () => {
      window.removeEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);
    };
  }, [reload]);

  const value = useMemo(
    () => ({ managesProject, canReview, pendingCount, reload }),
    [canReview, managesProject, pendingCount, reload],
  );

  return (
    <TeamReviewerAccessContext.Provider value={value}>
      {children}
    </TeamReviewerAccessContext.Provider>
  );
}
