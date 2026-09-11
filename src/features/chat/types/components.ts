import type { ChatTabId } from "@/features/chat/constants/chatConfig";

export type ChatBottomTabsProps = {
  activeTab: ChatTabId;
  onTabChange: (tab: ChatTabId) => void;
  counts: Partial<Record<ChatTabId, number>>;
};

export type ChatHeaderButtonProps = {
  mentionCount?: number;
};

export type ChatThreadListProps = {
  items: Array<{
    id: string;
    title: string;
    preview: string;
    href: string;
    meta?: string;
  }>;
  emptyMessage: string;
  isLoading?: boolean;
  onNavigate?: () => void;
  /** When set, each row shows a dismiss (×) control. */
  onDismissRequest?: (itemId: string) => void;
};

export type ProjectChatSectionProps = {
  smProjectId: string;
  canChat: boolean;
};
