import { createContext } from "react";

import type { ChatTabId } from "../constants/chatConfig";

export type ChatPanelContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activeTab: ChatTabId;
  setActiveTab: (tab: ChatTabId) => void;
  dismissalsEnabled: boolean;
  dismissedSets: {
    projects: Set<string>;
    tasks: Set<string>;
    mentions: Set<string>;
  };
  dismissItem: (kind: ChatTabId, itemId: string) => void;
};

export const ChatPanelContext = createContext<ChatPanelContextValue | null>(
  null,
);
