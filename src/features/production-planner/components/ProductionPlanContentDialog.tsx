import { useEffect, useState } from "react";

import type { ProductionPlanContentDialogProps } from "@/features/production-planner/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function ProductionPlanContentDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: ProductionPlanContentDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave = values.contentName.trim().length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Content" : "Add Content"}
            </DialogTitle>
            <DialogDescription>
              Add content to this production plan. Approval statuses are stored
              here for tracking — full approval workflow comes later.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <label className="block text-xs font-semibold text-muted-foreground">
              Content Name *
              <input
                value={values.contentName}
                onChange={(e) => onFieldChange("contentName", e.target.value)}
                placeholder="e.g. Reel 1 — Product unboxing"
                className={formFieldClassName}
                required
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Notes
              <textarea
                value={values.contentNotes}
                onChange={(e) => onFieldChange("contentNotes", e.target.value)}
                placeholder="Optional notes for this content..."
                className={formFieldClassName}
                rows={2}
                disabled={isSaving}
              />
            </label>

            <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
              <label className="block text-xs font-semibold text-muted-foreground">
                Manager/Admin Approval
                <select
                  value={values.managerApproval}
                  onChange={(e) =>
                    onFieldChange("managerApproval", e.target.value)
                  }
                  className={formFieldClassName}
                  disabled={isSaving}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>

              <label className="block text-xs font-semibold text-muted-foreground">
                Shoot Incharge Approval
                <select
                  value={values.shootInchargeApproval}
                  onChange={(e) =>
                    onFieldChange("shootInchargeApproval", e.target.value)
                  }
                  className={formFieldClassName}
                  disabled={isSaving}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive-outline"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Delete Content
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={onSave} disabled={!canSave || isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete plan content?"
        description="This permanently deletes this content from the plan."
        confirmLabel="Delete content"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          await onDelete?.();
          setIsConfirmOpen(false);
        }}
      />
    </>
  );
}
