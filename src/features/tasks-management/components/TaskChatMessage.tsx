import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import type { TaskChatMessageProps } from "@/features/tasks-management/types/components";
import {
  splitMessageWithMentions,
} from "@/features/tasks-management/utils/taskChatMentionUtils";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function MessageBody({
  body,
  participantNames,
  subtaskTitles,
  isMine,
}: {
  body: string;
  participantNames: string[];
  subtaskTitles: string[];
  isMine: boolean;
}) {
  const parts = splitMessageWithMentions(
    body,
    participantNames,
    subtaskTitles,
  );

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

export function TaskChatMessage({
  message,
  isMine,
  isEditing,
  participantNames,
  subtaskTitles,
  disabled = false,
  onEdit,
  onDelete,
}: TaskChatMessageProps) {
  const authorLabel = isMine
    ? "You"
    : (message.author?.member_name ??
      message.author_client?.client_name ??
      "Someone");

  return (
    <div
      className={cn(
        "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[85%]",
        isMine
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted text-foreground",
        isEditing && "ring-2 ring-primary-foreground/40",
      )}
    >
      <div
        className={cn(
          "mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[11px]",
          isMine ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        <span className="font-semibold">
          {authorLabel}
          {isEditing ? " · Editing" : null}
        </span>
        <div className="flex items-center gap-1">
          <span>
            {format(new Date(message.created_at), "MMM d, h:mm a")}
          </span>
          {isMine ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                className={cn(
                  "size-6",
                  isMine
                    ? "text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                    : null,
                )}
                onClick={onEdit}
                aria-label="Edit message"
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                className={cn(
                  "size-6",
                  isMine
                    ? "text-primary-foreground/80 hover:bg-primary-foreground/15 hover:text-primary-foreground"
                    : null,
                )}
                onClick={onDelete}
                aria-label="Delete message"
              >
                <Trash2 className="size-3" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <MessageBody
        body={message.body}
        participantNames={participantNames}
        subtaskTitles={subtaskTitles}
        isMine={isMine}
      />
    </div>
  );
}
