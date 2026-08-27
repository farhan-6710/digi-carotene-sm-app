import { useEffect, useMemo, useState } from "react";

import {
  TEAM_TODO_STATUS_LABELS,
  TEAM_TODO_STATUSES,
} from "@/features/team-portal/constants/teamTodoStatuses";
import type { TeamTodoStatus } from "@/features/team-portal/types/types";
import type { TeamTodoFormValues } from "@/features/team-portal/utils/teamTodoFormUtils";
import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { ComboBox } from "@/shared/ui/ComboBox";
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

type TeamTodoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: TeamTodoFormValues;
  onFieldChange: <K extends keyof TeamTodoFormValues>(
    field: K,
    value: TeamTodoFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function TeamTodoDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: TeamTodoDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const statusOptions = useMemo(
    () =>
      TEAM_TODO_STATUSES.map((status) => ({
        value: status,
        label: TEAM_TODO_STATUS_LABELS[status],
      })),
    [],
  );

  const canSave =
    values.title.trim().length > 0 &&
    Boolean(values.eta?.time.trim() && values.eta.day);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit to-do" : "Add to-do"}</DialogTitle>
            <DialogDescription>
              Personal reminder with an ETA deadline.
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
              Status
              <div className="mt-2">
                <ComboBox
                  value={values.status}
                  onChange={(next) => {
                    if (next) onFieldChange("status", next as TeamTodoStatus);
                  }}
                  options={statusOptions}
                  disabled={isSaving}
                  placeholder="Select status"
                  listTitle="Select status"
                  mode="value"
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
                {isEditing ? "Save" : "Add"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onDelete ? (
        <ConfirmationModal
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete to-do?"
          description="This permanently removes the to-do. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
