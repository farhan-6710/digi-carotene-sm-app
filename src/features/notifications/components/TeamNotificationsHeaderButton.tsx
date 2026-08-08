import { Link } from "react-router";
import { Bell } from "lucide-react";

import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/routes";
import { useTeamReviewerAccess } from "@/features/post-approvals/providers/teamReviewerAccessContext";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function TeamNotificationsHeaderButton() {
  const { canReview, pendingCount } = useTeamReviewerAccess();
  const showBadge = canReview && pendingCount > 0;

  return (
    <Button
      asChild
      type="button"
      variant="secondary"
      className="relative size-9 rounded-xl border border-border p-0"
      aria-label={
        showBadge
          ? `Open notifications, ${pendingCount} pending approvals`
          : "Open notifications"
      }
    >
      <Link to={NOTIFICATIONS_PATH}>
        <Bell className="size-4" aria-hidden="true" />
        {showBadge ? (
          <span
            className={cn(
              "absolute -right-1 -top-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full leading-none",
              "bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
            )}
          >
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
