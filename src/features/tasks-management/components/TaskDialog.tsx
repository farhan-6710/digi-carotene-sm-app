import { useEffect, useMemo, useState } from "react";

import { PostDateTimePicker } from "@/features/posts-management/components/PostDateTimePicker";
import {
  TaskAssigneesSelect,
  TaskDependenciesSelect,
} from "@/features/tasks-management/components/TaskMemberSelects";
import { TaskPrioritySelect } from "@/features/tasks-management/components/TaskPrioritySelect";
import { TaskProjectSelect } from "@/features/tasks-management/components/TaskProjectSelect";
import { TaskStatusSelect } from "@/features/tasks-management/components/TaskStatusSelect";
import type { TaskDialogProps } from "@/features/tasks-management/types/components";
import { encodeTaskAssignee } from "@/features/tasks-management/utils/taskAssigneeUtils";
import {
  getProjectAssociatedMemberIds,
  getProjectClientId,
  toTaskProjectPeopleSource,
} from "@/features/tasks-management/utils/taskProjectPeopleUtils";
import { parseProjectKey } from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjects } from "@/services/devProjectsService";
import { fetchProjects } from "@/services/projectsService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
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
  currentTeamMemberId = null,
  onFieldChange,
  onSave,
  onDelete,
}: TaskDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { items: smProjects } = useLazyEntityList(fetchProjects, {
    preload: open,
  });
  const { items: devProjects } = useLazyEntityList(fetchDevProjects, {
    preload: open,
  });

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const selectedProject = useMemo(() => {
    const parsed = parseProjectKey(values.projectId);
    if (!parsed) return null;
    if (parsed.kind === "sm") {
      const project = smProjects.find((row) => row.id === parsed.id);
      return project ? toTaskProjectPeopleSource(project) : null;
    }
    const project = devProjects.find((row) => row.id === parsed.id);
    return project ? toTaskProjectPeopleSource(project) : null;
  }, [devProjects, smProjects, values.projectId]);

  const projectMemberIds = useMemo(
    () =>
      selectedProject
        ? getProjectAssociatedMemberIds(selectedProject)
        : null,
    [selectedProject],
  );

  const projectClientId = selectedProject
    ? getProjectClientId(selectedProject)
    : null;

  const myselfKey = currentTeamMemberId
    ? encodeTaskAssignee("team", currentTeamMemberId)
    : null;
  const canAssignMyself =
    Boolean(myselfKey) &&
    Boolean(projectMemberIds?.includes(currentTeamMemberId ?? ""));

  const canSave =
    values.projectId.length > 0 &&
    values.title.trim().length > 0 &&
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
            <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              Tie the task to a project, assign one or more people, set
              priority, and set an ETA deadline.
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
                  onChange={({ projectKey }) =>
                    onFieldChange("projectId", projectKey)
                  }
                  disabled={isSaving}
                  preload={open}
                />
              </div>
            </label>

            <div className="space-y-2">
              <TaskAssigneesSelect
                value={values.assigneeKeys}
                onChange={(keys) => onFieldChange("assigneeKeys", keys)}
                allowedMemberIds={projectMemberIds}
                allowedClientId={projectClientId}
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

            <TaskDependenciesSelect
              value={values.dependencyKeys}
              onChange={(keys) => onFieldChange("dependencyKeys", keys)}
              allowedMemberIds={projectMemberIds}
              allowedClientId={projectClientId}
              excludeKeys={values.assigneeKeys}
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
