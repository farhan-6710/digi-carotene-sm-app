import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { toRepositoryDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import type { Task } from "@/features/tasks-management/types/types";
import { parseAssigneeKeys } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { parseDependencyKeys } from "@/features/tasks-management/utils/taskDependencyUtils";
import {
  emptyTaskFormValues,
  taskToFormValues,
  validateTaskForm,
  type TaskFormValues,
} from "@/features/tasks-management/utils/taskFormUtils";
import { parseProjectKey } from "@/features/projects-management/utils/projectKindUtils";
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
          next.assigneeKeys = [];
          next.dependencyKeys = [];
        }

        if (field === "assigneeKeys") {
          const keys = value as string[];
          next.dependencyKeys = current.dependencyKeys.filter(
            (dependencyKey) => !keys.includes(dependencyKey),
          );
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

    const { teamMemberIds, clientIds } = parseAssigneeKeys(values.assigneeKeys);
    if (teamMemberIds.length === 0 && clientIds.length === 0) {
      setError("Assign to at least one teammate or client.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const title = values.title.trim();
      const assigneeKeySet = new Set(values.assigneeKeys);
      const { taggedTeamMemberIds, dependencyClientId } = parseDependencyKeys(
        values.dependencyKeys.filter((key) => !assigneeKeySet.has(key)),
      );

      const parsedProject = parseProjectKey(values.projectId);
      if (!parsedProject) {
        setError("Select a project.");
        return;
      }

      const projectPayload =
        parsedProject.kind === "sm"
          ? { projectId: parsedProject.id, devProjectId: null }
          : { projectId: null, devProjectId: parsedProject.id };

      if (editingTaskId) {
        await updateTask(editingTaskId, {
          ...projectPayload,
          title,
          description: values.description,
          assigneeTeamMemberIds: teamMemberIds,
          assigneeClientIds: clientIds,
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
            ...projectPayload,
            title,
            description: values.description,
            assigneeTeamMemberIds: teamMemberIds,
            assigneeClientIds: clientIds,
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
