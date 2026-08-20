import { format } from "date-fns";
import { Loader2, RefreshCw, Send } from "lucide-react";

import type { TaskChatProps } from "@/features/tasks-management/types/components";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TaskChat({
  messages,
  currentTeamMemberId,
  draft,
  onDraftChange,
  onSend,
  onRefresh,
  isSending,
  isRefreshing = false,
}: TaskChatProps) {
  return (
    <div className="flex h-full min-h-[24rem] flex-col rounded-2xl border border-border bg-card shadow-sm lg:min-h-[28rem]">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Task chat</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Messages for everyone on this task. Refresh to load new replies.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onRefresh}
          disabled={isRefreshing || isSending}
        >
          {isRefreshing ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="flex max-h-[22rem] min-h-[12rem] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5 lg:max-h-none">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((message) => {
            const isMine =
              Boolean(currentTeamMemberId) &&
              message.author_team_member_id === currentTeamMemberId;

            return (
              <div
                key={message.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[85%]",
                  isMine
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                <div
                  className={cn(
                    "mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[11px]",
                    isMine
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="font-semibold">
                    {isMine
                      ? "You"
                      : (message.author?.member_name ?? "Teammate")}
                  </span>
                  <span>
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-5">
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Write a message…"
          disabled={isSending}
          className={cn(formFieldClassName, "min-h-20 resize-y")}
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            disabled={isSending || !draft.trim()}
            onClick={onSend}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
