import { Link } from "react-router";
import { ClipboardCheck } from "lucide-react";

import { POST_APPROVALS_PATH } from "@/features/post-approvals/constants/postApprovals";
import { usePendingApprovalsCount } from "@/features/post-approvals/hooks/usePendingApprovalsCount";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function TeamApprovalsHeaderButton() {
  const { teamMemberId, teamRole } = useAuth();
  const { count, canReview } = usePendingApprovalsCount({
    teamMemberId,
    teamRole,
  });

  if (!canReview) {
    return null;
  }

  return (
    <Button
      asChild
      type="button"
      variant="secondary"
      className="relative size-9 rounded-xl border border-border p-0"
      aria-label={`Open approvals${count > 0 ? `, ${count} pending` : ""}`}
    >
      <Link to={POST_APPROVALS_PATH}>
        <ClipboardCheck className="size-4" aria-hidden="true" />
        {count > 0 ? (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full",
              "bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
            )}
          >
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
