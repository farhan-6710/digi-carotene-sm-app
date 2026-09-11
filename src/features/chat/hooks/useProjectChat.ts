import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import type { ProjectMessage } from "@/features/chat/types/projectMessage";
import { extractMentionedIds } from "@/features/chat/utils/mentionIds";
import type { ProjectChatParticipant } from "@/features/chat/utils/projectChatAccess";
import {
  createProjectMessage,
  deleteProjectMessage,
  updateProjectMessage,
} from "@/services/projectMessagesService";
import { showToast } from "@/shared/utils/showToast";

type UseProjectChatOptions = {
  smProjectId: string;
  chatParticipants: ProjectChatParticipant[];
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useProjectChat({
  smProjectId,
  chatParticipants,
  reload,
  setError,
}: UseProjectChatOptions) {
  const { teamMemberId, clientId } = useAuth();
  const [draft, setDraft] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resolveMentions = useCallback(
    (body: string) => {
      if (!CHAT_CONFIG.rules.storeMentionsOnSend) {
        return { mentionedTeamMemberIds: [], mentionedClientIds: [] };
      }
      return extractMentionedIds(
        body,
        chatParticipants.map((participant) => ({
          id: participant.id,
          name: participant.member_name,
          kind: participant.kind,
        })),
      );
    },
    [chatParticipants],
  );

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setDraft("");
  }, []);

  const startEdit = useCallback((message: ProjectMessage) => {
    setPendingDeleteId(null);
    setEditingMessageId(message.id);
    setDraft(message.body);
  }, []);

  const sendMessage = useCallback(async () => {
    if (isSending) return;
    const body = draft.trim();
    if (!body) return;
    if (!teamMemberId && !clientId) return;

    const mentions = resolveMentions(body);
    setIsSending(true);
    setError(null);
    try {
      if (editingMessageId) {
        await updateProjectMessage(editingMessageId, body, mentions);
        showToast("success", "Message updated.");
        setEditingMessageId(null);
      } else {
        await createProjectMessage({
          smProjectId,
          authorTeamMemberId: teamMemberId,
          authorClientId: teamMemberId ? null : clientId,
          body,
          mentionedTeamMemberIds: mentions.mentionedTeamMemberIds,
          mentionedClientIds: mentions.mentionedClientIds,
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
    resolveMentions,
    setError,
    smProjectId,
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
      await deleteProjectMessage(pendingDeleteId);
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
