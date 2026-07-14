import { Link } from "react-router";
import { ClipboardCheck } from "lucide-react";

import { POST_APPROVALS_PATH } from "@/features/post-approvals/constants/postApprovals";
import { useTeamReviewerAccess } from "@/features/post-approvals/providers/teamReviewerAccessContext";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function TeamApprovalsHeaderButton() {
  const { canReview, pendingCount } = useTeamReviewerAccess();

  if (!canReview) {
    return null;
  }

  return (
    <Button
      asChild
      type="button"
      variant="secondary"
      className="relative size-9 rounded-xl border border-border p-0"
      aria-label={`Open approvals${pendingCount > 0 ? `, ${pendingCount} pending` : ""}`}
    >
      <Link to={POST_APPROVALS_PATH}>
        <ClipboardCheck className="size-4" aria-hidden="true" />
        {pendingCount > 0 ? (
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
