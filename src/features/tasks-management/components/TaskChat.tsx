import { Loader2, RefreshCw, Send } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { TaskChatMessage } from "@/features/tasks-management/components/TaskChatMessage";
import { taskChatMentionRoleLabel } from "@/features/tasks-management/constants/taskChatMentionRoles";
import type { TaskChatProps } from "@/features/tasks-management/types/components";
import type {
  TaskChatParticipant,
  TaskChatSubtaskOption,
} from "@/features/tasks-management/utils/taskChatMentionUtils";
import {
  filterMentionParticipants,
  filterSubtaskMentionOptions,
  getActiveMention,
  insertMention,
  type ActiveMention,
} from "@/features/tasks-management/utils/taskChatMentionUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TaskChat({
  messages,
  currentTeamMemberId,
  currentClientId = null,
  chatParticipants,
  subtasks = [],
  draft,
  onDraftChange,
  onSend,
  onRefresh,
  isSending,
  isRefreshing = false,
  editingMessageId = null,
  onEditMessage,
  onCancelEdit,
  onDeleteMessage,
  deleteConfirmOpen = false,
  onDeleteConfirmOpenChange,
  onConfirmDelete,
  isDeleting = false,
}: TaskChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [activeMention, setActiveMention] = useState<ActiveMention | null>(
    null,
  );
  const [highlightIndex, setHighlightIndex] = useState(0);
  const mentionKeyRef = useRef("");
  const isEditing = Boolean(editingMessageId);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!isEditing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [isEditing, editingMessageId]);

  const isClientPortal = Boolean(currentClientId);

  const participantNames = useMemo(
    () => chatParticipants.map((member) => member.member_name),
    [chatParticipants],
  );
  const subtaskTitles = useMemo(
    () => subtasks.map((subtask) => subtask.title),
    [subtasks],
  );

  const mentionParticipants = useMemo(
    () =>
      chatParticipants.filter((member) => {
        if (currentTeamMemberId && member.id === currentTeamMemberId) {
          return false;
        }
        if (currentClientId && member.id === currentClientId) {
          return false;
        }
        return true;
      }),
    [chatParticipants, currentClientId, currentTeamMemberId],
  );

  const personOptions = useMemo(() => {
    if (!activeMention || activeMention.kind !== "person") {
      return [] as TaskChatParticipant[];
    }
    return filterMentionParticipants(
      mentionParticipants,
      activeMention.query,
    );
  }, [activeMention, mentionParticipants]);

  const subtaskOptions = useMemo(() => {
    if (!activeMention || activeMention.kind !== "subtask") {
      return [] as TaskChatSubtaskOption[];
    }
    return filterSubtaskMentionOptions(subtasks, activeMention.query);
  }, [activeMention, subtasks]);

  const pickerOpen =
    Boolean(activeMention) &&
    ((activeMention?.kind === "person" && mentionParticipants.length > 0) ||
      (activeMention?.kind === "subtask" && subtasks.length > 0));

  const optionCount =
    activeMention?.kind === "subtask"
      ? subtaskOptions.length
      : personOptions.length;

  const syncMentionState = (text: string, nextCursor: number) => {
    setCursorIndex(nextCursor);
    const nextMention = getActiveMention(text, nextCursor);
    setActiveMention(nextMention);
    const nextKey = nextMention
      ? `${nextMention.kind}:${nextMention.startIndex}:${nextMention.query}`
      : "";
    if (nextKey !== mentionKeyRef.current) {
      mentionKeyRef.current = nextKey;
      setHighlightIndex(0);
    }
  };

  const applyPersonMention = (member: TaskChatParticipant) => {
    if (!activeMention || activeMention.kind !== "person") return;
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

  const applySubtaskMention = (subtask: TaskChatSubtaskOption) => {
    if (!activeMention || activeMention.kind !== "subtask") return;
    const { nextText, nextCursor } = insertMention(
      draft,
      cursorIndex,
      activeMention,
      subtask.title,
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
    if (pickerOpen && optionCount > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current + 1 >= optionCount ? 0 : current + 1,
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightIndex((current) =>
          current - 1 < 0 ? optionCount - 1 : current - 1,
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        if (activeMention?.kind === "subtask") {
          const selected = subtaskOptions[highlightIndex];
          if (selected) applySubtaskMention(selected);
        } else {
          const selected = personOptions[highlightIndex];
          if (selected) applyPersonMention(selected);
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveMention(null);
        return;
      }
    }

    if (event.key === "Escape" && isEditing && onCancelEdit) {
      event.preventDefault();
      onCancelEdit();
      return;
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
            Use @ to mention people and / to mention a subtask. Refresh for new
            replies.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onRefresh}
          disabled={isRefreshing || isSending || isDeleting}
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

            return (
              <TaskChatMessage
                key={message.id}
                message={message}
                isMine={isMine}
                isEditing={editingMessageId === message.id}
                participantNames={participantNames}
                subtaskTitles={subtaskTitles}
                disabled={isSending || isDeleting}
                onEdit={() => onEditMessage?.(message)}
                onDelete={() => onDeleteMessage?.(message.id)}
              />
            );
          })
        )}
      </div>

      <div className="relative shrink-0 border-t border-border px-4 py-4 sm:px-5">
        {pickerOpen ? (
          <div className="absolute inset-x-4 bottom-full z-20 mb-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg sm:inset-x-5">
            {activeMention?.kind === "subtask" ? (
              subtaskOptions.length === 0 ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No matching subtasks.
                </p>
              ) : (
                <ul className="max-h-40 overflow-y-auto py-1">
                  {subtaskOptions.map((subtask, index) => (
                    <li key={subtask.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center px-3 py-2 text-left text-sm transition-colors",
                          index === highlightIndex
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                        )}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          applySubtaskMention(subtask);
                        }}
                      >
                        <span className="min-w-0 truncate font-medium">
                          /{subtask.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : personOptions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No matching people on this task.
              </p>
            ) : (
              <ul className="max-h-40 overflow-y-auto py-1">
                {personOptions.map((member, index) => (
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
                        applyPersonMention(member);
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

        {isEditing ? (
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Editing message — Esc to cancel
          </p>
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
          placeholder="Write a message… @ people, / subtasks"
          disabled={isSending || isDeleting}
          className={cn(formFieldClassName, "max-h-32 min-h-20 resize-none")}
        />
        <div className="mt-2 flex justify-end gap-2">
          {isEditing && onCancelEdit ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSending || isDeleting}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={isSending || isDeleting || !draft.trim()}
            onClick={onSend}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isEditing ? "Save" : "Send"}
          </Button>
        </div>
      </div>

      {onDeleteConfirmOpenChange && onConfirmDelete ? (
        <ConfirmationModal
          open={deleteConfirmOpen}
          onOpenChange={onDeleteConfirmOpenChange}
          title="Delete message?"
          description="This removes the message from the task chat. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isDeleting}
          onConfirm={onConfirmDelete}
        />
      ) : null}
    </div>
  );
}
