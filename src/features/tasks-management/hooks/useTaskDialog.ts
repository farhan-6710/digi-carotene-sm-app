import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { toRepositoryDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import type { Task } from "@/features/tasks-management/types/types";
import { parseTaskAssignee } from "@/features/tasks-management/utils/taskAssigneeUtils";
import { parseDependencyKeys } from "@/features/tasks-management/utils/taskDependencyUtils";
import {
  emptyTaskFormValues,
  taskToFormValues,
  validateTaskForm,
  type TaskFormValues,
} from "@/features/tasks-management/utils/taskFormUtils";
import {
  createTask,
  deleteTask,
  updateTask,
} from "@/services/tasksService";
import { showToast } from "@/shared/utils/showToast";

type UseTaskDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTaskDialog({ reload, setError }: UseTaskDialogOptions) {
  const { teamMemberId } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<TaskFormValues>(emptyTaskFormValues);

  const resetForm = useCallback(() => {
    setValues(emptyTaskFormValues());
    setEditingTaskId(null);
  }, []);

  const onFieldChange = useCallback(
    <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
      setValues((current) => {
        const next: TaskFormValues = { ...current, [field]: value };

        if (field === "projectId" && value !== current.projectId) {
          next.assigneeKey = "";
          next.dependencyKeys = [];
        }

        if (field === "assigneeKey") {
          const key = String(value);
          if (key) {
            next.dependencyKeys = current.dependencyKeys.filter(
              (dependencyKey) => dependencyKey !== key,
            );
          }
        }

        return next;
      });
    },
    [],
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setValues(taskToFormValues(task));
    setIsDialogOpen(true);
  }, []);

  const saveTask = useCallback(async () => {
    if (isSaving || !teamMemberId) return;

    const validationError = validateTaskForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    const eta = toRepositoryDateTime(values.eta);
    if (!eta) {
      setError("ETA requires both date and time.");
      return;
    }

    const assignee = parseTaskAssignee(values.assigneeKey);
    if (!assignee) {
      setError("Select a teammate or client to assign.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const title = values.title.trim();
      const assignedToTeamMemberId =
        assignee.kind === "team" ? assignee.id : null;
      const clientId = assignee.kind === "client" ? assignee.id : null;
      const { taggedTeamMemberIds, dependencyClientId } = parseDependencyKeys(
        values.dependencyKeys.filter((key) => key !== values.assigneeKey),
      );

      if (editingTaskId) {
        await updateTask(editingTaskId, {
          projectId: values.projectId,
          clientId,
          title,
          description: values.description,
          assignedToTeamMemberId,
          priority: values.priority,
          etaDate: eta.date,
          etaTime: eta.time,
          status: values.status,
          taggedTeamMemberIds,
          dependencyClientId,
        });
        showToast("success", `"${title}" updated successfully.`);
      } else {
        await createTask(
          {
            projectId: values.projectId,
            clientId,
            title,
            description: values.description,
            assignedToTeamMemberId,
            priority: values.priority,
            etaDate: eta.date,
            etaTime: eta.time,
            taggedTeamMemberIds,
            dependencyClientId,
          },
          teamMemberId,
        );
        showToast("success", `"${title}" created successfully.`);
      }
      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save task.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingTaskId,
    handleDialogOpenChange,
    isSaving,
    reload,
    setError,
    teamMemberId,
    values,
  ]);

  const removeTask = useCallback(async () => {
    if (!editingTaskId || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteTask(editingTaskId);
      showToast("success", "Task deleted.");
      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete task.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingTaskId, handleDialogOpenChange, isSaving, reload, setError]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: Boolean(editingTaskId),
      isSaving,
      values,
      currentTeamMemberId: teamMemberId,
      onFieldChange,
      onSave: () => void saveTask(),
      onDelete: editingTaskId ? () => void removeTask() : undefined,
    },
  };
}
