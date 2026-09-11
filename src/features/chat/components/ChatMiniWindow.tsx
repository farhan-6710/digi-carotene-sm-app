import { useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { ChatBottomTabs } from "@/features/chat/components/ChatBottomTabs";
import { ChatThreadList } from "@/features/chat/components/ChatThreadList";
import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";
import { useChatInbox } from "@/features/chat/hooks/useChatInbox";
import { useChatPanel } from "@/features/chat/hooks/useChatPanel";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function formatChatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatMiniWindow() {
  const {
    isOpen,
    close,
    activeTab,
    setActiveTab,
    dismissalsEnabled,
    dismissedSets,
    dismissItem,
  } = useChatPanel();
  const { inbox, isLoading, error } = useChatInbox();
  const [pendingDismissId, setPendingDismissId] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  const visibleProjects = useMemo(
    () =>
      inbox.projectThreads.filter(
        (thread) => !dismissedSets.projects.has(thread.id),
      ),
    [dismissedSets.projects, inbox.projectThreads],
  );
  const visibleTasks = useMemo(
    () =>
      inbox.taskThreads.filter((thread) => !dismissedSets.tasks.has(thread.id)),
    [dismissedSets.tasks, inbox.taskThreads],
  );
  const visibleMentions = useMemo(
    () =>
      inbox.mentions.filter((item) => !dismissedSets.mentions.has(item.id)),
    [dismissedSets.mentions, inbox.mentions],
  );

  if (!isOpen) return null;

  const { panel } = CHAT_CONFIG;

  const listItems =
    activeTab === "projects"
      ? visibleProjects.map((thread) => ({
          id: thread.id,
          title: thread.title,
          preview: thread.preview,
          href: thread.href,
          meta: formatChatTime(thread.updatedAt),
        }))
      : activeTab === "tasks"
        ? visibleTasks.map((thread) => ({
            id: thread.id,
            title: thread.title,
            preview: thread.preview,
            href: thread.href,
            meta: formatChatTime(thread.updatedAt),
          }))
        : visibleMentions.map((item) => ({
            id: item.id,
            title: item.title,
            preview: item.body,
            href: item.href,
            meta: formatChatTime(item.createdAt),
          }));

  const pendingItem = listItems.find((item) => item.id === pendingDismissId);

  const emptyMessage =
    activeTab === "projects"
      ? "No project chats yet. Message in a project to see it here."
      : activeTab === "tasks"
        ? "No task chats yet. Send a message on a task to see it here."
        : "No mentions yet. When someone @mentions you, it shows up here.";

  const confirmDismiss = () => {
    if (!pendingDismissId || isDismissing) return;
    setIsDismissing(true);
    try {
      dismissItem(activeTab, pendingDismissId);
      setPendingDismissId(null);
    } finally {
      setIsDismissing(false);
    }
  };

  return (
    <div
      className={cn(
        panel.positionClass,
        panel.zIndexClass,
        panel.widthClass,
        panel.maxWidthClass,
        panel.heightClass,
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
      )}
      role="dialog"
      aria-label="Chats"
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">Chats</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 rounded-full p-0"
          aria-label="Close chats"
          onClick={close}
        >
          <X className="size-4" aria-hidden />
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error ? (
          <p className="px-4 py-6 text-center text-sm text-destructive">
            {error}
          </p>
        ) : (
          <ChatThreadList
            items={listItems}
            emptyMessage={emptyMessage}
            isLoading={isLoading}
            onNavigate={close}
            onDismissRequest={
              dismissalsEnabled
                ? (itemId) => setPendingDismissId(itemId)
                : undefined
            }
          />
        )}
      </div>

      <ChatBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          mentions: visibleMentions.length,
        }}
      />

      <ConfirmationModal
        open={Boolean(pendingDismissId)}
        onOpenChange={(open) => {
          if (!open && !isDismissing) setPendingDismissId(null);
        }}
        title="Remove from chats?"
        description={
          pendingItem
            ? `“${pendingItem.title}” will be hidden from this chat window. The original conversation is not deleted.`
            : "This item will be hidden from this chat window. The original conversation is not deleted."
        }
        confirmLabel="Remove"
        confirmVariant="destructive"
        loading={isDismissing}
        onConfirm={confirmDismiss}
      />
    </div>
  );
}
