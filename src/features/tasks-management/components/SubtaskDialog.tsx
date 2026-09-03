import { useEffect, useState } from "react";

import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
import { TaskAssigneesSelect } from "@/features/tasks-management/components/TaskMemberSelects";
import { TaskPrioritySelect } from "@/features/tasks-management/components/TaskPrioritySelect";
import { TaskStatusSelect } from "@/features/tasks-management/components/TaskStatusSelect";
import type { SubtaskDialogProps } from "@/features/tasks-management/types/components";
import { encodeTaskAssignee } from "@/features/tasks-management/utils/taskAssigneeUtils";
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

export function SubtaskDialog({
  open,
  onOpenChange,
  isEditing,
  statusOnly = false,
  isSaving = false,
  values,
  allowedMemberIds,
  allowedClientIds,
  currentTeamMemberId = null,
  currentClientId = null,
  onFieldChange,
  onSave,
  onDelete,
}: SubtaskDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const myselfKey = currentTeamMemberId
    ? encodeTaskAssignee("team", currentTeamMemberId)
    : currentClientId
      ? encodeTaskAssignee("client", currentClientId)
      : null;
  const canAssignMyself = currentTeamMemberId
    ? allowedMemberIds.includes(currentTeamMemberId)
    : currentClientId
      ? allowedClientIds.includes(currentClientId)
      : false;

  const canSave = statusOnly
    ? true
    : values.title.trim().length > 0 &&
      values.description.trim().length > 0 &&
      values.assigneeKeys.length > 0 &&
      Boolean(
        values.eta?.time.trim() &&
          values.eta.day &&
          values.eta.month &&
          values.eta.year,
      );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] w-[calc(100vw-1.5rem)] max-w-lg! flex-col overflow-hidden sm:w-full sm:max-w-xl!">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {statusOnly
                ? "Update status"
                : isEditing
                  ? "Edit Subtask"
                  : "Add Subtask"}
            </DialogTitle>
            <DialogDescription>
              {statusOnly
                ? "Mark this subtask in progress or completed when you’re done."
                : "Explain what is needed, assign one or more project teammates or the client, set priority, and set an ETA."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            {statusOnly ? (
              <>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {values.title}
                  </p>
                  {values.description ? (
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                      {values.description}
                    </p>
                  ) : null}
                </div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Status
                  <div className="mt-2">
                    <TaskStatusSelect
                      value={values.status}
                      onChange={(status) => onFieldChange("status", status)}
                      disabled={isSaving}
                    />
                  </div>
                </label>
              </>
            ) : (
              <>
                <label className="block text-xs font-semibold text-muted-foreground">
                  Title
                  <input
                    value={values.title}
                    onChange={(e) => onFieldChange("title", e.target.value)}
                    className={cn(formFieldClassName, "mt-2")}
                    placeholder="Subtask title"
                    disabled={isSaving}
                  />
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  Description
                  <textarea
                    value={values.description}
                    onChange={(e) =>
                      onFieldChange("description", e.target.value)
                    }
                    className={cn(formFieldClassName, "mt-2 min-h-20 resize-y")}
                    placeholder="What does this subtask require?"
                    disabled={isSaving}
                  />
                </label>

                <div className="space-y-2">
                  <TaskAssigneesSelect
                    value={values.assigneeKeys}
                    onChange={(keys) => onFieldChange("assigneeKeys", keys)}
                    allowedMemberIds={allowedMemberIds}
                    allowedClientIds={allowedClientIds}
                    disabled={isSaving}
                    preload={open}
                  />
                  {myselfKey ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={
                        isSaving ||
                        !canAssignMyself ||
                        values.assigneeKeys.includes(myselfKey)
                      }
                      onClick={() =>
                        onFieldChange("assigneeKeys", [
                          ...values.assigneeKeys,
                          myselfKey,
                        ])
                      }
                    >
                      Assign myself
                    </Button>
                  ) : null}
                </div>

                <label className="block text-xs font-semibold text-muted-foreground">
                  Priority
                  <div className="mt-2">
                    <TaskPrioritySelect
                      value={values.priority}
                      onChange={(priority) =>
                        onFieldChange("priority", priority)
                      }
                      disabled={isSaving}
                    />
                  </div>
                </label>

                <PostDateTimePicker
                  label="ETA"
                  value={values.eta}
                  onChange={(eta) => onFieldChange("eta", eta)}
                  required
                  disabled={isSaving}
                />

                {isEditing ? (
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Status
                    <div className="mt-2">
                      <TaskStatusSelect
                        value={values.status}
                        onChange={(status) => onFieldChange("status", status)}
                        disabled={isSaving}
                      />
                    </div>
                  </label>
                ) : null}
              </>
            )}
          </div>

          <DialogFooter className="shrink-0 gap-2 sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive-outline"
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
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete subtask?"
        description="This cannot be undone."
        confirmLabel="Delete"
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
