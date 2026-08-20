import { useCallback, useEffect, useState } from "react";

import type { AppNotification } from "@/features/notifications/types/types";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/notifications/constants/notificationTypes";
import {
  fetchUnreadNotifications,
  markNotificationRead,
} from "@/services/notificationsService";
import {
  approvePostApprovalRequest,
  fetchPendingApprovalsForReviewer,
  rejectPostApprovalRequest,
} from "@/services/postApprovalsService";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { showToast } from "@/shared/utils/showToast";

type UseNotificationsInboxOptions = {
  teamMemberId: string | null;
  teamRole: TeamMemberRole | null;
};

export function useNotificationsInbox({
  teamMemberId,
  teamRole,
}: UseNotificationsInboxOptions) {
  const [digestNotifications, setDigestNotifications] = useState<
    AppNotification[]
  >([]);
  const [taskNotifications, setTaskNotifications] = useState<
    AppNotification[]
  >([]);
  const [approvalRequests, setApprovalRequests] = useState<
    PostApprovalRequest[]
  >([]);
  const [notificationIdByRequestId, setNotificationIdByRequestId] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewingId, setIsReviewingId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!teamMemberId) {
      setDigestNotifications([]);
      setTaskNotifications([]);
      setApprovalRequests([]);
      setNotificationIdByRequestId({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Pending approvals come from the workflow table (includes pre-notification rows).
      // Unread approval notifications only drive the dismiss (X) mapping.
      const [pendingRequests, approvalNotifs, digests, tasks] =
        await Promise.all([
          teamRole
            ? fetchPendingApprovalsForReviewer(teamMemberId, teamRole)
            : Promise.resolve([] as PostApprovalRequest[]),
          fetchUnreadNotifications(teamMemberId, "approval"),
          fetchUnreadNotifications(teamMemberId, "post_digest"),
          fetchUnreadNotifications(teamMemberId, "task"),
        ]);

      setApprovalRequests(pendingRequests);
      setDigestNotifications(digests);
      setTaskNotifications(tasks);

      const idMap: Record<string, string> = {};
      for (const notification of approvalNotifs) {
        if (notification.related_id) {
          idMap[notification.related_id] = notification.id;
        }
      }
      setNotificationIdByRequestId(idMap);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications.",
      );
      setDigestNotifications([]);
      setTaskNotifications([]);
      setApprovalRequests([]);
      setNotificationIdByRequestId({});
    } finally {
      setIsLoading(false);
    }
  }, [teamMemberId, teamRole]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();

    const handleUpdated = () => {
      void reload();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated);
    window.addEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated);
      window.removeEventListener(POST_APPROVALS_UPDATED_EVENT, handleUpdated);
    };
  }, [reload]);

  const dismissNotification = useCallback(
    async (notificationId: string) => {
      if (dismissingId) {
        return;
      }

      setDismissingId(notificationId);
      try {
        await markNotificationRead(notificationId);
        showToast("success", "Notification dismissed.");
        await reload();
      } catch (err) {
        showToast(
          "error",
          err instanceof Error
            ? err.message
            : "Failed to dismiss notification.",
        );
      } finally {
        setDismissingId(null);
      }
    },
    [dismissingId, reload],
  );

  const dismissApprovalByRequestId = useCallback(
    async (requestId: string) => {
      const notificationId = notificationIdByRequestId[requestId];
      if (!notificationId) {
        return;
      }
      await dismissNotification(notificationId);
    },
    [dismissNotification, notificationIdByRequestId],
  );

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
    digestNotifications,
    taskNotifications,
    approvalRequests,
    notificationIdByRequestId,
    isLoading,
    error,
    isReviewingId,
    dismissingId,
    reload,
    dismissNotification,
    dismissApprovalByRequestId,
    approveRequest,
    rejectRequest,
  };
}
