import { useState } from "react";

import { PostApprovalRejectDialog } from "@/features/post-approvals/components/PostApprovalRejectDialog";
import { PostApprovalsTable } from "@/features/post-approvals/components/PostApprovalsTable";
import { usePostApprovalsQuery } from "@/features/post-approvals/hooks/usePostApprovalsQuery";
import { useTeamReviewerAccess } from "@/features/post-approvals/providers/teamReviewerAccessContext";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ErrorBanner } from "@/shared/components/ErrorBanner";

export function PostApprovalsSection() {
  const { teamMemberId, teamRole } = useAuth();
  const { canReview } = useTeamReviewerAccess();
  const [rejectingRequest, setRejectingRequest] =
    useState<PostApprovalRequest | null>(null);

  const {
    requests,
    isLoading,
    error,
    isReviewingId,
    approveRequest,
    rejectRequest,
  } = usePostApprovalsQuery({ teamMemberId, teamRole });

  if (!canReview) {
    return null;
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingRequest) {
      return;
    }

    const rejected = await rejectRequest(rejectingRequest.id, reason);
    if (rejected) {
      setRejectingRequest(null);
    }
  };

  return (
    <div className="space-y-4">
      {error ? <ErrorBanner message={error} /> : null}

      <PostApprovalsTable
        requests={requests}
        isLoading={isLoading}
        isReviewingId={isReviewingId}
        onApprove={(requestId) => void approveRequest(requestId)}
        onReject={(requestId) => {
          const request =
            requests.find((entry) => entry.id === requestId) ?? null;
          setRejectingRequest(request);
        }}
      />

      <PostApprovalRejectDialog
        open={rejectingRequest !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingRequest(null);
          }
        }}
        request={rejectingRequest}
        isSubmitting={isReviewingId === rejectingRequest?.id}
        onConfirm={(reason) => void handleRejectConfirm(reason)}
      />
    </div>
  );
}
