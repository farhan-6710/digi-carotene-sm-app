import { useEffect, useState } from "react";

import { LeadActivityStatusSelect } from "@/features/crm/components/LeadActivityStatusSelect";
import type { LeadCallFormValues } from "@/features/crm/utils/leadActivityFormUtils";
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

type LeadCallDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: LeadCallFormValues;
  onFieldChange: <K extends keyof LeadCallFormValues>(
    field: K,
    value: LeadCallFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function LeadCallDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: LeadCallDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const duration = Number(values.durationMinutes);
  const canSave =
    values.title.trim().length > 0 &&
    Boolean(values.start?.time.trim() && values.start.day) &&
    Number.isFinite(duration) &&
    duration > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit call" : "Add call"}</DialogTitle>
            <DialogDescription>
              Log a call activity on this lead.
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
              label="Call start"
              value={values.start}
              onChange={(start) => onFieldChange("start", start)}
              required
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Duration (minutes)
              <input
                type="number"
                min={1}
                step={1}
                value={values.durationMinutes}
                onChange={(event) =>
                  onFieldChange("durationMinutes", event.target.value)
                }
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2")}
              />
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
          title="Delete call?"
          description="This removes the call from the lead. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
