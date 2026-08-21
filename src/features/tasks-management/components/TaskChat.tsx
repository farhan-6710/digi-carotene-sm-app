import { format } from "date-fns";
import { Loader2, RefreshCw, Send } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import type { TaskChatProps } from "@/features/tasks-management/types/components";
import { taskChatMentionRoleLabel } from "@/features/tasks-management/constants/taskChatMentionRoles";
import type {
  TaskChatParticipant,
} from "@/features/tasks-management/utils/taskChatMentionUtils";
import {
  filterMentionParticipants,
  getActiveMention,
  insertMention,
  splitMessageWithMentions,
  type ActiveMention,
} from "@/features/tasks-management/utils/taskChatMentionUtils";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function MessageBody({
  body,
  participantNames,
  isMine,
}: {
  body: string;
  participantNames: string[];
  isMine: boolean;
}) {
  const parts = splitMessageWithMentions(body, participantNames);

  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, index) =>
        part.isMention ? (
          <span
            key={`${index}-${part.text}`}
            className={cn(
              "font-semibold",
              isMine ? "text-primary-foreground underline" : "text-primary",
            )}
          >
            {part.text}
          </span>
        ) : (
          <span key={`${index}-${part.text.slice(0, 12)}`}>{part.text}</span>
        ),
      )}
    </p>
  );
}

export function TaskChat({
  messages,
  currentTeamMemberId,
  currentClientId = null,
  chatParticipants,
  draft,
  onDraftChange,
  onSend,
  onRefresh,
  isSending,
  isRefreshing = false,
}: TaskChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [activeMention, setActiveMention] = useState<ActiveMention | null>(
    null,
  );
  const [highlightIndex, setHighlightIndex] = useState(0);
  const mentionKeyRef = useRef("");

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isClientPortal = Boolean(currentClientId);

  const participantNames = useMemo(
    () => chatParticipants.map((member) => member.member_name),
    [chatParticipants],
  );

  const mentionParticipants = useMemo(
    () =>
      chatParticipants.filter((member) => {
        // Don't offer @yourself for teammates. Clients still see themselves as
        // "Myself" so the label is clear, but selecting it is harmless.
        if (currentTeamMemberId && member.id === currentTeamMemberId) {
          return false;
        }
        return true;
      }),
    [chatParticipants, currentTeamMemberId],
  );

  const mentionOptions = useMemo(() => {
    if (!activeMention) return [] as TaskChatParticipant[];
    return filterMentionParticipants(
      mentionParticipants,
      activeMention.query,
    );
  }, [activeMention, mentionParticipants]);

  const syncMentionState = (text: string, nextCursor: number) => {
    setCursorIndex(nextCursor);
    const nextMention = getActiveMention(text, nextCursor);
    setActiveMention(nextMention);
    const nextKey = nextMention
      ? `${nextMention.startIndex}:${nextMention.query}`
      : "";
    if (nextKey !== mentionKeyRef.current) {
      mentionKeyRef.current = nextKey;
      setHighlightIndex(0);
    }
  };

  const applyMention = (member: TaskChatParticipant) => {
    if (!activeMention) return;
    const { nextText, nextCursor } = insertMention(
      draft,
      cursorIndex,
      activeMention,
      member.member_name,
    );
    onDraftChange(nextText);
    setActiveMention(null);
    mentionKeyRef.current = "";
    setCursorIndex(nextCursor);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (activeMention && mentionOptions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current + 1 >= mentionOptions.length ? 0 : current + 1,
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current - 1 < 0 ? mentionOptions.length - 1 : current - 1,
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        const selected = mentionOptions[highlightIndex];
        if (selected) applyMention(selected);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveMention(null);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-full max-h-[min(40rem,calc(100dvh-12rem))] min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:min-h-[28rem]">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Task chat</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Use @ to mention teammates or the client on this task. Refresh for
            new replies.
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

      <div
        ref={messagesContainerRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((message) => {
            const isMine =
              (Boolean(currentTeamMemberId) &&
                message.author_team_member_id === currentTeamMemberId) ||
              (Boolean(currentClientId) &&
                message.author_client_id === currentClientId);

            const authorLabel = isMine
              ? "You"
              : message.author?.member_name ??
                message.author_client?.client_name ??
                "Someone";

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
                  <span className="font-semibold">{authorLabel}</span>
                  <span>
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <MessageBody
                  body={message.body}
                  participantNames={participantNames}
                  isMine={isMine}
                />
              </div>
            );
          })
        )}
      </div>

      <div className="relative shrink-0 border-t border-border px-4 py-4 sm:px-5">
        {activeMention && mentionParticipants.length > 0 ? (
          <div className="absolute inset-x-4 bottom-full z-20 mb-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg sm:inset-x-5">
            {mentionOptions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No matching people on this task.
              </p>
            ) : (
              <ul className="max-h-40 overflow-y-auto py-1">
                {mentionOptions.map((member, index) => (
                  <li key={member.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                        index === highlightIndex
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        applyMention(member);
                      }}
                    >
                      <span className="min-w-0 truncate font-medium">
                        @{member.member_name}
                      </span>
                      <span className="flex shrink-0 flex-wrap justify-end gap-1">
                        {member.roles.map((role) => (
                          <span
                            key={role}
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                              index === highlightIndex
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {taskChatMentionRoleLabel(role, {
                              isClientPortal,
                            })}
                          </span>
                        ))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            const next = e.target.value;
            const nextCursor = e.target.selectionStart ?? next.length;
            onDraftChange(next);
            syncMentionState(next, nextCursor);
          }}
          onClick={(e) => {
            const nextCursor = e.currentTarget.selectionStart ?? 0;
            syncMentionState(draft, nextCursor);
          }}
          onKeyUp={(e) => {
            const nextCursor = e.currentTarget.selectionStart ?? 0;
            syncMentionState(draft, nextCursor);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a message… Use @ to mention someone"
          disabled={isSending}
          className={cn(formFieldClassName, "max-h-32 min-h-20 resize-none")}
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
