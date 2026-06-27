import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";
import { canAccessApprovalsNav } from "@/features/post-approvals/utils/postApprovalRules";
import {
  countPendingApprovalsForReviewer,
  managesAnyProject,
} from "@/services/postApprovalsService";
import { useAuth } from "@/features/auth/hooks/useAuth";

type TeamReviewerAccessContextValue = {
  managesProject: boolean;
  canReview: boolean;
  pendingCount: number;
  reload: () => Promise<void>;
};

const TeamReviewerAccessContext =
  createContext<TeamReviewerAccessContextValue | null>(null);

export function TeamReviewerAccessProvider({ children }: { children: ReactNode }) {
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
      const hasAccess = canAccessApprovalsNav(teamRole, manages);

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
    () => ({
      managesProject,
      canReview,
      pendingCount,
      reload,
    }),
    [canReview, managesProject, pendingCount, reload],
  );

  return (
    <TeamReviewerAccessContext.Provider value={value}>
      {children}
    </TeamReviewerAccessContext.Provider>
  );
}

export function useTeamReviewerAccess(): TeamReviewerAccessContextValue {
  const context = useContext(TeamReviewerAccessContext);
  if (!context) {
    throw new Error("useTeamReviewerAccess must be used within TeamReviewerAccessProvider.");
  }

  return context;
}
