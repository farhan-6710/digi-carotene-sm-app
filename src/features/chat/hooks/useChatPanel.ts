import { useContext } from "react";

import { ChatPanelContext } from "@/features/chat/providers/chatPanelContext";

export function useChatPanel() {
  const context = useContext(ChatPanelContext);
  if (!context) {
    throw new Error("useChatPanel must be used within ChatPanelProvider");
  }
  return context;
}
