import { useEffect, useState } from "react";

import { LeadDialogFields } from "@/features/crm/components/LeadDialogFields";
import type { LeadDialogProps } from "@/features/crm/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
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

export function LeadDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: LeadDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave = values.name.trim().length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>{isEditing ? "Edit Lead" : "Create Lead"}</DialogTitle>
            <DialogDescription>
              Capture a lead with contact details, status, and source. Keep fields
              short and update status as you progress.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <LeadDialogFields
              values={values}
              onFieldChange={onFieldChange}
              disabled={isSaving}
            />
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive-outline"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Remove Lead
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={onSave} disabled={!canSave || isSaving}>
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove lead?"
        description="This permanently deletes the lead. This cannot be undone."
        confirmLabel="Remove lead"
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
