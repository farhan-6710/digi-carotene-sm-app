import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import type { PostApprovalsTableProps } from "@/features/post-approvals/types/components";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import {
  formatApprovalPostLabel,
  formatApprovalProjectLabel,
  formatApprovalPostingTimeLabel,
} from "@/features/post-approvals/utils/postApprovalDisplayUtils";
import { DIRECTORY_TABLE_MIN_WIDTH_CLASS } from "@/shared/constants/directoryTable";
import { Button } from "@/shared/ui/button";

type PostApprovalsTableRowProps = {
  request: PostApprovalRequest;
  isReviewing: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
};

function PostApprovalsTableRow({
  request,
  isReviewing,
  onApprove,
  onReject,
}: PostApprovalsTableRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] items-center gap-4 border-b border-border/60 px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">
          {formatApprovalPostLabel(request)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {request.requested_by_name ?? "Unknown requester"}
        </div>
      </div>
      <div className="min-w-0 truncate text-sm text-foreground">
        {formatApprovalProjectLabel(request)}
      </div>
      <div className="text-sm text-foreground">
        {formatApprovalPostingTimeLabel(request)}
      </div>
      <div className="text-sm text-muted-foreground">
        {format(new Date(request.created_at), "MMM d, yyyy")}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isReviewing}
          onClick={() => onReject(request.id)}
        >
          Reject
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isReviewing}
          onClick={() => onApprove(request.id)}
        >
          {isReviewing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Approve"
          )}
        </Button>
      </div>
    </div>
  );
}

export function PostApprovalsTable({
  requests,
  isLoading,
  isReviewingId,
  onApprove,
  onReject,
}: PostApprovalsTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        No pending approval requests right now.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-2xl border border-border bg-card">
      <div className={DIRECTORY_TABLE_MIN_WIDTH_CLASS}>
        {requests.map((request) => (
          <PostApprovalsTableRow
            key={request.id}
            request={request}
            isReviewing={isReviewingId === request.id}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
}
