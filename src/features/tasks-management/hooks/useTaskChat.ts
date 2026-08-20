import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { createTaskMessage } from "@/services/taskMessagesService";
import { showToast } from "@/shared/utils/showToast";

type UseTaskChatOptions = {
  taskId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTaskChat({ taskId, reload, setError }: UseTaskChatOptions) {
  const { teamMemberId } = useAuth();
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!teamMemberId || isSending) return;
    const body = draft.trim();
    if (!body) return;

    setIsSending(true);
    setError(null);
    try {
      await createTaskMessage({
        taskId,
        authorTeamMemberId: teamMemberId,
        body,
      });
      setDraft("");
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSending(false);
    }
  }, [draft, isSending, reload, setError, taskId, teamMemberId]);

  return {
    draft,
    setDraft,
    isSending,
    sendMessage,
  };
}
