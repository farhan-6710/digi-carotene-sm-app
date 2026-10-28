import { useEffect, useState } from "react";

import { LeadFollowUpStatusSelect } from "@/features/crm/components/LeadFollowUpStatusSelect";
import type { LeadFollowUpDialogProps } from "@/features/crm/types/components";
import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
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
import { cn } from "@/shared/lib/utils";

export function LeadFollowUpDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: LeadFollowUpDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave = Boolean(values.when);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit follow-up" : "Add follow-up"}
            </DialogTitle>
            <DialogDescription>
              Schedule a follow-up. Date is required; time is optional.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <PostDateTimePicker
              label="Follow-up"
              value={values.when}
              onChange={(when) => onFieldChange("when", when)}
              required
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Note
              <textarea
                value={values.note}
                onChange={(event) => onFieldChange("note", event.target.value)}
                disabled={isSaving}
                placeholder="Optional note…"
                className={cn(formFieldClassName, "mt-2 min-h-20 resize-none")}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Status
              <div className="mt-2">
                <LeadFollowUpStatusSelect
                  value={values.status}
                  onChange={(status) => onFieldChange("status", status)}
                  disabled={isSaving}
                />
              </div>
            </label>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                disabled={isSaving}
                onClick={() => setIsConfirmOpen(true)}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isSaving || !canSave}
                onClick={onSave}
              >
                {isEditing ? "Save" : "Create"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onDelete ? (
        <ConfirmationModal
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete follow-up?"
          description="This removes the follow-up from the lead. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
