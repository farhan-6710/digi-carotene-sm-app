import { useEffect, useState } from "react";

import { PostApprovalRejectDialog } from "@/features/post-approvals/components/PostApprovalRejectDialog";
import { PostApprovalsTable } from "@/features/post-approvals/components/PostApprovalsTable";
import { postApprovalsDirectoryConfig } from "@/features/post-approvals/constants/postApprovals";
import { usePostApprovalsQuery } from "@/features/post-approvals/hooks/usePostApprovalsQuery";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import { canAccessApprovalsNav } from "@/features/post-approvals/utils/postApprovalRules";
import { managesAnyProject } from "@/features/post-approvals/utils/postApprovalsRepository";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageShell } from "@/shared/components/PageShell";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function PostApprovalsPage() {
  const { teamMemberId, teamRole } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<PostApprovalRequest | null>(
    null,
  );

  const {
    requests,
    isLoading,
    error,
    isReviewingId,
    approveRequest,
    rejectRequest,
  } = usePostApprovalsQuery({ teamMemberId, teamRole });

  useEffect(() => {
    let isMounted = true;

    async function loadAccess() {
      if (!teamMemberId || !teamRole) {
        if (isMounted) {
          setHasAccess(false);
        }
        return;
      }

      try {
        const managesProject = await managesAnyProject(teamMemberId);
        if (isMounted) {
          setHasAccess(canAccessApprovalsNav(teamRole, managesProject));
        }
      } catch {
        if (isMounted) {
          setHasAccess(false);
        }
      }
    }

    void loadAccess();

    return () => {
      isMounted = false;
    };
  }, [teamMemberId, teamRole]);

  if (hasAccess === null) {
    return <CenteredLoading />;
  }

  if (!hasAccess) {
    return (
      <PageShell
        heading="Approvals"
        description="You do not have permission to review post approval requests."
      >
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          Only project managers and admins can review backdated post requests.
        </div>
      </PageShell>
    );
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
    <PageShell
      heading="Approvals"
      description={postApprovalsDirectoryConfig.description}
      error={error}
    >
      <PostApprovalsTable
        requests={requests}
        isLoading={isLoading}
        isReviewingId={isReviewingId}
        onApprove={(requestId) => void approveRequest(requestId)}
        onReject={(requestId) => {
          const request = requests.find((entry) => entry.id === requestId) ?? null;
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
    </PageShell>
  );
}
