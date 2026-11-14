import { useEffect, useRef } from "react";

import { AssistantMark } from "./AssistantMark";
import { AssistantRichText } from "./AssistantRichText";
import { ASSISTANT_NAME } from "../constants/assistantSuggestions";
import { useTypewriter } from "../hooks/useTypewriter";
import type {
  AssistantMessagesProps,
  AssistantReplyProps,
} from "../types/components";

const FOLLOW_DISTANCE_PX = 160;
const BUBBLE =
  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs";

function AssistantAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-primary shadow-xs">
      <AssistantMark className="size-4.5" />
    </span>
  );
}

function TypingBubble() {
  return (
    <div
      className="flex animate-message-in items-end gap-2"
      role="status"
      aria-label={`${ASSISTANT_NAME} is thinking`}
    >
      <AssistantAvatar />
      <span className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 shadow-xs">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

function AssistantReply({ message, live, onNavigate }: AssistantReplyProps) {
  const { text, isTyping } = useTypewriter(message.text, live);
  return (
    <div className="flex animate-message-in items-end gap-2">
      <AssistantAvatar />
      <div
        className={`${BUBBLE} min-w-0 rounded-bl-md border border-border bg-card`}
      >
        <AssistantRichText
          text={text}
          onNavigate={onNavigate}
          streaming={live || isTyping}
        />
      </div>
    </div>
  );
}

export function AssistantMessages({
  messages,
  status,
  streamingId,
  error,
  onNavigate,
}: AssistantMessagesProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, status, error]);

  useEffect(() => {
    const list = listRef.current;
    const scroller = list?.parentElement;
    if (!list || !scroller) return;
    const observer = new ResizeObserver(() => {
      const distanceFromEnd =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (distanceFromEnd < FOLLOW_DISTANCE_PX) {
        endRef.current?.scrollIntoView({ block: "end" });
      }
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={listRef} className="flex-1 space-y-4 px-4 py-5">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex animate-message-in justify-end">
            <p
              className={`${BUBBLE} rounded-br-md bg-primary whitespace-pre-wrap text-primary-foreground`}
            >
              {message.text}
            </p>
          </div>
        ) : (
          <AssistantReply
            key={message.id}
            message={message}
            live={message.id === streamingId}
            onNavigate={onNavigate}
          />
        ),
      )}
      {status === "thinking" ? <TypingBubble /> : null}
      {error ? (
        <p
          role="alert"
          className="animate-message-in rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
