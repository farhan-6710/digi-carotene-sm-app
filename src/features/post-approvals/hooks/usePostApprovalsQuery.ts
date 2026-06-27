import { useCallback, useEffect, useState } from "react";

import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import {
  approvePostApprovalRequest,
  fetchPendingApprovalsForReviewer,
  rejectPostApprovalRequest,
} from "@/services/postApprovalsService";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { showToast } from "@/shared/utils/showToast";

type UsePostApprovalsQueryOptions = {
  teamMemberId: string | null;
  teamRole: TeamMemberRole | null;
};

export function usePostApprovalsQuery({
  teamMemberId,
  teamRole,
}: UsePostApprovalsQueryOptions) {
  const [requests, setRequests] = useState<PostApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewingId, setIsReviewingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!teamMemberId || !teamRole) {
      setRequests([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextRequests = await fetchPendingApprovalsForReviewer(
        teamMemberId,
        teamRole,
      );
      setRequests(nextRequests);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load approval requests.",
      );
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [teamMemberId, teamRole]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const approveRequest = useCallback(
    async (requestId: string) => {
      if (!teamMemberId || isReviewingId) {
        return;
      }

      setIsReviewingId(requestId);

      try {
        await approvePostApprovalRequest(requestId, teamMemberId);
        showToast("success", "Post approval request approved.");
        await reload();
      } catch (err) {
        showToast(
          "error",
          err instanceof Error ? err.message : "Failed to approve request.",
        );
      } finally {
        setIsReviewingId(null);
      }
    },
    [isReviewingId, reload, teamMemberId],
  );

  const rejectRequest = useCallback(
    async (requestId: string, reason: string) => {
      if (!teamMemberId || isReviewingId) {
        return false;
      }

      setIsReviewingId(requestId);

      try {
        await rejectPostApprovalRequest(requestId, teamMemberId, reason);
        showToast("success", "Post approval request rejected.");
        await reload();
        return true;
      } catch (err) {
        showToast(
          "error",
          err instanceof Error ? err.message : "Failed to reject request.",
        );
        return false;
      } finally {
        setIsReviewingId(null);
      }
    },
    [isReviewingId, reload, teamMemberId],
  );

  return {
    requests,
    isLoading,
    error,
    isReviewingId,
    reload,
    approveRequest,
    rejectRequest,
    setError,
  };
}
