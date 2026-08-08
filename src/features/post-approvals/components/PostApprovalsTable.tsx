import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { postApprovalsDirectoryConfig } from "@/features/post-approvals/constants/postApprovals";
import type { PostApprovalsTableProps } from "@/features/post-approvals/types/components";
import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import {
  formatApprovalPostLabel,
  formatApprovalPostingTimeLabel,
  formatApprovalProjectLabel,
} from "@/features/post-approvals/utils/postApprovalDisplayUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

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
    <div
      className={cn(
        "grid items-center gap-4 px-6 py-4",
        postApprovalsDirectoryConfig.gridClass,
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {formatApprovalPostLabel(request)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {request.requested_by_name ?? "Unknown requester"}
        </p>
      </div>
      <p className="min-w-0 truncate text-sm text-foreground">
        {formatApprovalProjectLabel(request)}
      </p>
      <p className="text-sm text-foreground">
        {formatApprovalPostingTimeLabel(request)}
      </p>
      <p className="text-sm text-muted-foreground">
        {format(new Date(request.created_at), "MMM d, yyyy")}
      </p>
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
  return (
    <DirectoryTable
      title={postApprovalsDirectoryConfig.title}
      description={postApprovalsDirectoryConfig.description}
      gridClass={postApprovalsDirectoryConfig.gridClass}
      columns={[...postApprovalsDirectoryConfig.columns]}
      emptyMessage={postApprovalsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={requests.length === 0}
    >
      {requests.map((request) => (
        <PostApprovalsTableRow
          key={request.id}
          request={request}
          isReviewing={isReviewingId === request.id}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </DirectoryTable>
  );
}
