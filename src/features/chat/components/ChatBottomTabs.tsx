import { getEnabledChatTabs, type ChatTabId } from "@/features/chat/constants/chatConfig";
import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import type { ChatBottomTabsProps } from "@/features/chat/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ChatBottomTabs({
  activeTab,
  onTabChange,
  counts,
}: ChatBottomTabsProps) {
  const tabs = getEnabledChatTabs();

  return (
    <nav
      className="flex shrink-0 gap-1 border-t border-border/60 bg-card p-2"
      aria-label="Chat sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id as ChatTabId] ?? 0;
        const showBadge =
          CHAT_CONFIG.rules.showTabCounters &&
          (
            CHAT_CONFIG.rules.tabCounterTabs as readonly ChatTabId[]
          ).includes(tab.id) &&
          count > 0;

        return (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "relative h-9 flex-1 rounded-xl text-xs",
              !isActive && "text-muted-foreground",
            )}
            aria-pressed={isActive}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {showBadge ? (
              <span
                className={cn(
                  "absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full",
                  "bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground",
                )}
              >
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </Button>
        );
      })}
    </nav>
  );
}
