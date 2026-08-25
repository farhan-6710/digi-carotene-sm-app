import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { toRepositoryDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import type { Subtask } from "@/features/tasks-management/types/types";
import { parseAssigneeKeys } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { canFullyEditSubtaskAccess } from "@/features/tasks-management/utils/taskAccessUtils";
import {
  emptySubtaskFormValues,
  subtaskToFormValues,
  validateSubtaskForm,
  type SubtaskFormValues,
} from "@/features/tasks-management/utils/subtaskFormUtils";
import {
  createSubtask,
  deleteSubtask,
  updateSubtask,
} from "@/services/subtasksService";
import { showToast } from "@/shared/utils/showToast";

type UseSubtaskDialogOptions = {
  parentTaskId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useSubtaskDialog({
  parentTaskId,
  reload,
  setError,
}: UseSubtaskDialogOptions) {
  const { teamMemberId, clientId } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [statusOnly, setStatusOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<SubtaskFormValues>(
    emptySubtaskFormValues,
  );

  const resetForm = useCallback(() => {
    setValues(emptySubtaskFormValues());
    setEditingSubtaskId(null);
    setStatusOnly(false);
  }, []);

  const onFieldChange = useCallback(
    <K extends keyof SubtaskFormValues>(
      field: K,
      value: SubtaskFormValues[K],
    ) => {
      setValues((current) => ({ ...current, [field]: value }));
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

  const openEditDialog = useCallback(
    (subtask: Subtask) => {
      const fullEdit = canFullyEditSubtaskAccess({
        subtask,
        teamMemberId,
        clientId,
      });
      setEditingSubtaskId(subtask.id);
      setValues(subtaskToFormValues(subtask));
      setStatusOnly(!fullEdit);
      setIsDialogOpen(true);
    },
    [clientId, teamMemberId],
  );

  const saveSubtask = useCallback(async () => {
    if (isSaving || (!teamMemberId && !clientId) || !parentTaskId) return;

    const validationError = validateSubtaskForm(values, { statusOnly });
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (editingSubtaskId && statusOnly) {
        await updateSubtask(editingSubtaskId, { status: values.status });
        showToast("success", `"${values.title.trim()}" status updated.`);
        await reload();
        handleDialogOpenChange(false);
        return;
      }

      const eta = toRepositoryDateTime(values.eta);
      if (!eta) {
        setError("ETA requires both date and time.");
        return;
      }

      const { teamMemberIds, clientIds } = parseAssigneeKeys(
        values.assigneeKeys,
      );
      if (teamMemberIds.length === 0 && clientIds.length === 0) {
        setError("Assign to at least one teammate or client.");
        return;
      }

      const title = values.title.trim();
      const description = values.description.trim();

      if (editingSubtaskId) {
        await updateSubtask(editingSubtaskId, {
          title,
          description,
          assigneeTeamMemberIds: teamMemberIds,
          assigneeClientIds: clientIds,
          priority: values.priority,
          etaDate: eta.date,
          etaTime: eta.time,
          status: values.status,
        });
        showToast("success", `"${title}" updated successfully.`);
      } else {
        await createSubtask(
          {
            parentTaskId,
            title,
            description,
            assigneeTeamMemberIds: teamMemberIds,
            assigneeClientIds: clientIds,
            priority: values.priority,
            etaDate: eta.date,
            etaTime: eta.time,
          },
          { teamMemberId, clientId },
        );
        showToast("success", `"${title}" created successfully.`);
      }
      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save subtask.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    clientId,
    editingSubtaskId,
    handleDialogOpenChange,
    isSaving,
    parentTaskId,
    reload,
    setError,
    statusOnly,
    teamMemberId,
    values,
  ]);

  const removeSubtask = useCallback(async () => {
    if (!editingSubtaskId || isSaving || statusOnly) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteSubtask(editingSubtaskId);
      showToast("success", "Subtask deleted.");
      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete subtask.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingSubtaskId,
    handleDialogOpenChange,
    isSaving,
    reload,
    setError,
    statusOnly,
  ]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: Boolean(editingSubtaskId),
      statusOnly,
      isSaving,
      values,
      currentTeamMemberId: teamMemberId,
      onFieldChange,
      onSave: () => void saveSubtask(),
      onDelete:
        editingSubtaskId && !statusOnly
          ? () => void removeSubtask()
          : undefined,
    },
  };
}
