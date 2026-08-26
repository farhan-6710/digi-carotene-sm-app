import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { TaskMessage } from "@/features/tasks-management/types/types";
import {
  createTaskMessage,
  deleteTaskMessage,
  updateTaskMessage,
} from "@/services/taskMessagesService";
import { showToast } from "@/shared/utils/showToast";

type UseTaskChatOptions = {
  taskId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTaskChat({ taskId, reload, setError }: UseTaskChatOptions) {
  const { teamMemberId, clientId } = useAuth();
  const [draft, setDraft] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setDraft("");
  }, []);

  const startEdit = useCallback((message: TaskMessage) => {
    setPendingDeleteId(null);
    setEditingMessageId(message.id);
    setDraft(message.body);
  }, []);

  const sendMessage = useCallback(async () => {
    if (isSending) return;
    const body = draft.trim();
    if (!body) return;
    if (!teamMemberId && !clientId) return;

    setIsSending(true);
    setError(null);
    try {
      if (editingMessageId) {
        await updateTaskMessage(editingMessageId, body);
        showToast("success", "Message updated.");
        setEditingMessageId(null);
      } else {
        await createTaskMessage({
          taskId,
          authorTeamMemberId: teamMemberId,
          authorClientId: teamMemberId ? null : clientId,
          body,
        });
      }
      setDraft("");
      await reload();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : editingMessageId
            ? "Failed to update message."
            : "Failed to send message.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSending(false);
    }
  }, [
    clientId,
    draft,
    editingMessageId,
    isSending,
    reload,
    setError,
    taskId,
    teamMemberId,
  ]);

  const requestDelete = useCallback(
    (messageId: string) => {
      if (editingMessageId === messageId) cancelEdit();
      setPendingDeleteId(messageId);
    },
    [cancelEdit, editingMessageId],
  );

  const cancelDelete = useCallback(() => {
    if (isDeleting) return;
    setPendingDeleteId(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteId || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTaskMessage(pendingDeleteId);
      showToast("success", "Message deleted.");
      setPendingDeleteId(null);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete message.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, pendingDeleteId, reload, setError]);

  return {
    draft,
    setDraft,
    isSending,
    sendMessage,
    editingMessageId,
    startEdit,
    cancelEdit,
    requestDelete,
    deleteConfirmOpen: Boolean(pendingDeleteId),
    onDeleteConfirmOpenChange: (open: boolean) => {
      if (!open) cancelDelete();
    },
    confirmDelete,
    isDeleting,
  };
}
