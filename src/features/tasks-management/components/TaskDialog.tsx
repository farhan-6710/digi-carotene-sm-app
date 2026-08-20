import { useEffect, useState } from "react";

import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
import { TaskAssigneeSelect, TaskTagsSelect } from "@/features/tasks-management/components/TaskMemberSelects";
import { TaskPrioritySelect } from "@/features/tasks-management/components/TaskPrioritySelect";
import { TaskProjectSelect } from "@/features/tasks-management/components/TaskProjectSelect";
import { TaskStatusSelect } from "@/features/tasks-management/components/TaskStatusSelect";
import type { TaskDialogProps } from "@/features/tasks-management/types/components";
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

export function TaskDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: TaskDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.projectId.length > 0 &&
    values.title.trim().length > 0 &&
    values.assignedToTeamMemberId.length > 0 &&
    Boolean(values.eta?.time.trim() && values.eta.day && values.eta.month && values.eta.year);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] w-[calc(100vw-1.5rem)] max-w-lg! flex-col overflow-hidden sm:w-full sm:max-w-xl!">
          <DialogHeader className="shrink-0">
            <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              Tie the task to a project, assign a teammate, set priority, and
              set an ETA deadline.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <label className="block text-xs font-semibold text-muted-foreground">
              Title
              <input
                value={values.title}
                onChange={(e) => onFieldChange("title", e.target.value)}
                className={cn(formFieldClassName, "mt-2")}
                placeholder="Task title"
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                value={values.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                className={cn(formFieldClassName, "mt-2 min-h-20 resize-y")}
                placeholder="Eg:- this is a blocker in my work."
                disabled={isSaving}
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Project
              <div className="mt-2">
                <TaskProjectSelect
                  value={values.projectId}
                  onChange={(projectId) => onFieldChange("projectId", projectId)}
                  disabled={isSaving}
                  preload={open}
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Assign to
              <div className="mt-2">
                <TaskAssigneeSelect
                  value={values.assignedToTeamMemberId}
                  onChange={(id) => onFieldChange("assignedToTeamMemberId", id)}
                  disabled={isSaving}
                  preload={open}
                />
              </div>
            </label>

            <TaskTagsSelect
              value={values.taggedTeamMemberIds}
              onChange={(ids) => onFieldChange("taggedTeamMemberIds", ids)}
              excludeMemberIds={
                values.assignedToTeamMemberId
                  ? [values.assignedToTeamMemberId]
                  : []
              }
              disabled={isSaving}
              preload={open}
            />

            <label className="block text-xs font-semibold text-muted-foreground">
              Priority
              <div className="mt-2">
                <TaskPrioritySelect
                  value={values.priority}
                  onChange={(priority) => onFieldChange("priority", priority)}
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
        title="Delete task?"
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
