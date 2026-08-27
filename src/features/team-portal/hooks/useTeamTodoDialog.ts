import { useCallback, useState } from "react";

import type { TeamTodo } from "@/features/team-portal/types/types";
import {
  EMPTY_TEAM_TODO_FORM,
  teamTodoToFormValues,
  type TeamTodoFormValues,
} from "@/features/team-portal/utils/teamTodoFormUtils";
import { toRepositoryDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import {
  createTeamTodo,
  deleteTeamTodo,
  updateTeamTodo,
} from "@/services/teamTodosService";
import { showToast } from "@/shared/utils/showToast";

type UseTeamTodoDialogOptions = {
  teamMemberId: string | null;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTeamTodoDialog({
  teamMemberId,
  reload,
  setError,
}: UseTeamTodoDialogOptions) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TeamTodo | null>(null);
  const [values, setValues] = useState<TeamTodoFormValues>(EMPTY_TEAM_TODO_FORM);

  const openAddDialog = useCallback(() => {
    setEditingTodo(null);
    setValues(EMPTY_TEAM_TODO_FORM);
    setOpen(true);
  }, []);

  const openEditDialog = useCallback((todo: TeamTodo) => {
    setEditingTodo(todo);
    setValues(teamTodoToFormValues(todo));
    setOpen(true);
  }, []);

  const onFieldChange = useCallback(
    <K extends keyof TeamTodoFormValues>(
      field: K,
      value: TeamTodoFormValues[K],
    ) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const onSave = useCallback(async () => {
    if (isSaving || !teamMemberId) return;
    const eta = toRepositoryDateTime(values.eta);
    if (!eta || !values.title.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        title: values.title,
        description: values.description || null,
        etaDate: eta.date,
        etaTime: eta.time,
        status: values.status,
      };
      if (editingTodo) {
        await updateTeamTodo(editingTodo.id, payload);
        showToast("success", "To-do updated.");
      } else {
        await createTeamTodo(teamMemberId, payload);
        showToast("success", "To-do added.");
      }
      setOpen(false);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save to-do.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingTodo, isSaving, reload, setError, teamMemberId, values]);

  const onDelete = useCallback(async () => {
    if (!editingTodo || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteTeamTodo(editingTodo.id);
      showToast("success", "To-do deleted.");
      setOpen(false);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete to-do.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingTodo, isSaving, reload, setError]);

  const removeTodo = useCallback(
    async (todoId: string) => {
      if (isSaving) return;
      setIsSaving(true);
      setError(null);
      try {
        await deleteTeamTodo(todoId);
        showToast("success", "To-do deleted.");
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete to-do.";
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reload, setError],
  );

  return {
    open,
    onOpenChange: setOpen,
    isEditing: Boolean(editingTodo),
    isSaving,
    values,
    onFieldChange,
    onSave,
    onDelete: editingTodo ? onDelete : undefined,
    openAddDialog,
    openEditDialog,
    removeTodo,
  };
}
