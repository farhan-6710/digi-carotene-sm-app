import { useState } from "react";

import { PostApprovalRejectDialog } from "@/features/post-approvals/components/PostApprovalRejectDialog";
import { PostApprovalsTable } from "@/features/post-approvals/components/PostApprovalsTable";
import { PostDigestNotificationsTable } from "@/features/notifications/components/PostDigestNotificationsTable";
import { TaskNotificationsTable } from "@/features/notifications/components/TaskNotificationsTable";
import { useNotificationsInbox } from "@/features/notifications/hooks/useNotificationsInbox";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageShell } from "@/shared/components/PageShell";

export function NotificationsPage() {
  const { teamMemberId, teamRole } = useAuth();
  const [rejectingRequest, setRejectingRequest] =
    useState<PostApprovalRequest | null>(null);

  const {
    digestNotifications,
    taskNotifications,
    approvalRequests,
    notificationIdByRequestId,
    isLoading,
    error,
    isReviewingId,
    dismissingId,
    dismissNotification,
    dismissApprovalByRequestId,
    approveRequest,
    rejectRequest,
  } = useNotificationsInbox({ teamMemberId, teamRole });

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
      heading="Notifications"
      description="Requests and alerts that need a response from your team."
    >
      {error ? <ErrorBanner message={error} /> : null}

      <div className="space-y-6">
        <PostApprovalsTable
          requests={approvalRequests}
          isLoading={isLoading}
          isReviewingId={isReviewingId}
          dismissingId={dismissingId}
          notificationIdByRequestId={notificationIdByRequestId}
          onApprove={(requestId) => void approveRequest(requestId)}
          onReject={(requestId) => {
            const request =
              approvalRequests.find((entry) => entry.id === requestId) ?? null;
            setRejectingRequest(request);
          }}
          onDismiss={(requestId) => void dismissApprovalByRequestId(requestId)}
        />

        <TaskNotificationsTable
          notifications={taskNotifications}
          isLoading={isLoading}
          dismissingId={dismissingId}
          onDismiss={(notificationId) =>
            void dismissNotification(notificationId)
          }
        />

        <PostDigestNotificationsTable
          notifications={digestNotifications}
          isLoading={isLoading}
          dismissingId={dismissingId}
          onDismiss={(notificationId) =>
            void dismissNotification(notificationId)
          }
        />
      </div>

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
