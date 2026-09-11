import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChatInboxSnapshot } from "@/features/chat/types/types";
import { fetchChatInbox } from "@/services/chatInboxService";
import { useFetch } from "@/shared/hooks/useFetch";

const EMPTY: ChatInboxSnapshot = {
  projectThreads: [],
  taskThreads: [],
  mentions: [],
};

export function useChatInbox() {
  const { teamMemberId, clientId, isClient } = useAuth();

  const load = useCallback(() => {
    return fetchChatInbox({
      teamMemberId,
      clientId,
      isClientPortal: isClient,
    });
  }, [clientId, isClient, teamMemberId]);

  const { data, isLoading, error, reload } = useFetch(load, EMPTY);

  return {
    inbox: data,
    isLoading,
    error,
    reload,
    mentionCount: data.mentions.length,
    taskCount: data.taskThreads.length,
    projectCount: data.projectThreads.length,
  };
}
