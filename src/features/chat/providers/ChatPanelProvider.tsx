import { useCallback, useMemo, useState, type ReactNode } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CHAT_CONFIG,
  type ChatTabId,
} from "@/features/chat/constants/chatConfig";
import {
  ChatPanelContext,
  type ChatPanelContextValue,
} from "@/features/chat/providers/chatPanelContext";
import {
  readChatInboxDismissals,
  writeChatInboxDismissal,
} from "@/features/chat/utils/chatInboxDismissals";

export function ChatPanelProvider({ children }: { children: ReactNode }) {
  const { teamMemberId, clientId } = useAuth();
  const actorKey = teamMemberId || clientId || "";

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTabId>(CHAT_CONFIG.defaultTab);
  const [dismissalVersion, setDismissalVersion] = useState(0);

  const dismissals = useMemo(() => {
    void dismissalVersion;
    return readChatInboxDismissals(actorKey);
  }, [actorKey, dismissalVersion]);

  const dismissItem = useCallback(
    (kind: ChatTabId, itemId: string) => {
      if (!CHAT_CONFIG.dismissals.enabled || !actorKey) return;
      writeChatInboxDismissal(actorKey, kind, itemId);
      setDismissalVersion((version) => version + 1);
    },
    [actorKey],
  );

  const dismissedSets = useMemo(
    () => ({
      projects: new Set(dismissals.projects),
      tasks: new Set(dismissals.tasks),
      mentions: new Set(dismissals.mentions),
    }),
    [dismissals],
  );

  const value = useMemo<ChatPanelContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
      activeTab,
      setActiveTab,
      dismissalsEnabled: CHAT_CONFIG.dismissals.enabled,
      dismissedSets,
      dismissItem,
    }),
    [activeTab, dismissItem, dismissedSets, isOpen],
  );

  return (
    <ChatPanelContext.Provider value={value}>
      {children}
    </ChatPanelContext.Provider>
  );
}
