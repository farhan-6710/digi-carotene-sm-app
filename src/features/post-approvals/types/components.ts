import type { PostApprovalRequest } from "@/features/post-approvals/types/types";

export type PostApprovalsTableProps = {
  requests: PostApprovalRequest[];
  isLoading: boolean;
  isReviewingId: string | null;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
};

export type PostApprovalRejectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PostApprovalRequest | null;
  isSubmitting: boolean;
  onConfirm: (reason: string) => void;
};
