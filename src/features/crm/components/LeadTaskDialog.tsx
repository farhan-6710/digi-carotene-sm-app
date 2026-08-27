import { useEffect, useState } from "react";

import { LeadActivityPrioritySelect } from "@/features/crm/components/LeadActivityPrioritySelect";
import { LeadActivityStatusSelect } from "@/features/crm/components/LeadActivityStatusSelect";
import type { LeadTaskFormValues } from "@/features/crm/utils/leadActivityFormUtils";
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

type LeadTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: LeadTaskFormValues;
  onFieldChange: <K extends keyof LeadTaskFormValues>(
    field: K,
    value: LeadTaskFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function LeadTaskDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: LeadTaskDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.title.trim().length > 0 &&
    Boolean(values.eta?.time.trim() && values.eta.day);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit task" : "Add task"}</DialogTitle>
            <DialogDescription>
              Track a follow-up task on this lead.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Title
              <input
                type="text"
                value={values.title}
                onChange={(event) => onFieldChange("title", event.target.value)}
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2")}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                value={values.description}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2 min-h-20 resize-none")}
              />
            </label>
            <PostDateTimePicker
              label="ETA"
              value={values.eta}
              onChange={(eta) => onFieldChange("eta", eta)}
              required
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Priority
              <div className="mt-2">
                <LeadActivityPrioritySelect
                  value={values.priority}
                  onChange={(priority) => onFieldChange("priority", priority)}
                  disabled={isSaving}
                />
              </div>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Status
              <div className="mt-2">
                <LeadActivityStatusSelect
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
          title="Delete task?"
          description="This removes the task from the lead. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
