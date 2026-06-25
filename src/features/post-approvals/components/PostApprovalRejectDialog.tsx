import { useState } from "react";

import type { PostApprovalRejectDialogProps } from "@/features/post-approvals/types/components";
import {
  formatApprovalPostLabel,
  formatApprovalPostingTimeLabel,
} from "@/features/post-approvals/utils/postApprovalDisplayUtils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function PostApprovalRejectDialog({
  open,
  onOpenChange,
  request,
  isSubmitting,
  onConfirm,
}: PostApprovalRejectDialogProps) {
  const [reason, setReason] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReason("");
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject approval request</DialogTitle>
          <DialogDescription>
            {request
              ? `${formatApprovalPostLabel(request)} · ${formatApprovalPostingTimeLabel(request)}`
              : "This post will not be added to the calendar."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Reason (optional)</Label>
          <textarea
            id="rejection-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Share why this backdated post was rejected."
            disabled={isSubmitting}
            rows={4}
            className={cn(
              "flex min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => onConfirm(reason)}
          >
            Reject request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
