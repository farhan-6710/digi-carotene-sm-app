/**
 * Chat feature root config — tabs, panel layout, and product rules.
 * Change values here instead of hunting through components.
 */
export const CHAT_CONFIG = {
  /** Floating mini window (header chat icon). */
  panel: {
    maxWidthClass: "max-w-[380px]",
    heightClass: "h-[80vh]",
    zIndexClass: "z-50",
    positionClass: "fixed bottom-4 right-4",
    widthClass: "w-[calc(100vw-2rem)]",
  },

  /** Bottom tabs inside the mini window (mobile-app style). */
  tabs: [
    { id: "projects", label: "Projects", enabled: true },
    { id: "tasks", label: "Tasks", enabled: true },
    { id: "mentions", label: "Mentions", enabled: true },
  ] as const,

  defaultTab: "mentions" as const,

  /** How many rows to load per inbox tab. */
  inboxPageSize: 40,

  /** Hide-from-inbox (cross icon) — does not delete the underlying chat. */
  dismissals: {
    enabled: true,
    storageKeyPrefix: "digi-carotene.chat.inboxDismissals",
  },

  rules: {
    /** Persist @mention participant ids on send (task + project chat). */
    storeMentionsOnSend: true,
    /** Show red counters on tab labels (mentions only — matches header badge). */
    showTabCounters: true,
    tabCounterTabs: ["mentions"] as const,
    /** Badge on the header chat icon (mention count). */
    showHeaderBadge: true,
    /**
     * Project kinds that get an in-page chat panel.
     * V1: SM projects only (admin / client / manager / team members).
     */
    projectChatKinds: ["sm"] as const,
    /** Who may use project chat when they belong to the project. */
    projectChatRoles: ["admin", "client", "manager", "team_member"] as const,
  },
} as const;

export type ChatTabId = (typeof CHAT_CONFIG.tabs)[number]["id"];

export function getEnabledChatTabs() {
  return CHAT_CONFIG.tabs.filter((tab) => tab.enabled);
}
