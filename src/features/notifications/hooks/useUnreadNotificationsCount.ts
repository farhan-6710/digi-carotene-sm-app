import { useCallback, useEffect, useState } from "react";

import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/notifications/constants/notificationTypes";
import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { countUnreadNotifications } from "@/services/notificationsService";
import { countPendingApprovalsForReviewer } from "@/services/postApprovalsService";

type UseUnreadNotificationsCountOptions = {
  teamMemberId: string | null;
  teamRole: TeamMemberRole | null;
};

/**
 * Bell badge = pending approvals for this reviewer
 * + unread post_digest and task inbox rows (approval alerts are covered by pending count).
 */
export function useUnreadNotificationsCount({
  teamMemberId,
  teamRole,
}: UseUnreadNotificationsCountOptions) {
  const [unreadCount, setUnreadCount] = useState(0);

  const reload = useCallback(async () => {
    if (!teamMemberId) {
      setUnreadCount(0);
      return;
    }

    try {
      const [pendingApprovals, unreadDigests, unreadTasks, unreadTaskDigests] =
        await Promise.all([
          teamRole
            ? countPendingApprovalsForReviewer(teamMemberId, teamRole)
            : Promise.resolve(0),
          countUnreadNotifications(teamMemberId, "post_digest"),
          countUnreadNotifications(teamMemberId, "task"),
          countUnreadNotifications(teamMemberId, "task_digest"),
        ]);
      setUnreadCount(
        pendingApprovals + unreadDigests + unreadTasks + unreadTaskDigests,
      );
    } catch {
      setUnreadCount(0);
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

  return { unreadCount, reload };
}
