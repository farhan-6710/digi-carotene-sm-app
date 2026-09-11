import { useMemo } from "react";
import { MessageCircle } from "lucide-react";

import { ChatMiniWindow } from "@/features/chat/components/ChatMiniWindow";
import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import { useChatInbox } from "@/features/chat/hooks/useChatInbox";
import { useChatPanel } from "@/features/chat/hooks/useChatPanel";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ChatHeaderButton() {
  const { isOpen, toggle, dismissedSets } = useChatPanel();
  const { inbox } = useChatInbox();

  const mentionCount = useMemo(
    () =>
      inbox.mentions.filter((item) => !dismissedSets.mentions.has(item.id))
        .length,
    [dismissedSets.mentions, inbox.mentions],
  );

  const showBadge =
    CHAT_CONFIG.rules.showHeaderBadge && mentionCount > 0;

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="relative size-9 rounded-xl border border-border p-0"
        aria-label={
          showBadge
            ? `Open chats, ${mentionCount} mentions`
            : isOpen
              ? "Close chats"
              : "Open chats"
        }
        aria-pressed={isOpen}
        onClick={toggle}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {showBadge ? (
          <span
            className={cn(
              "absolute -right-1 -top-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full leading-none",
              "bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
            )}
          >
            {mentionCount > 9 ? "9+" : mentionCount}
          </span>
        ) : null}
      </Button>
      <ChatMiniWindow />
    </>
  );
}
