import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Keyboard, SendHorizontal } from "lucide-react";

import type { AssistantComposerProps } from "../types/components";
import { Button } from "@/shared/ui/button";

const MAX_LENGTH = 2_000;

/** Pill input with a round send button. Enter sends, Shift+Enter adds a line. */
export function AssistantComposer({ disabled, onSend }: AssistantComposerProps) {
  const [value, setValue] = useState("");
  const canSend = Boolean(value.trim()) && !disabled;

  function send(event?: FormEvent) {
    event?.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      send(event);
    }
  }

  return (
    <form onSubmit={send} className="shrink-0 px-4 pt-2 pb-3">
      <div className="flex items-end gap-2 rounded-3xl border border-border bg-card py-1.5 pr-1.5 pl-4 shadow-sm transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30">
        <label htmlFor="growth-assistant-input" className="sr-only">
          Ask Pulse
        </label>
        <textarea
          id="growth-assistant-input"
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about this campaign…"
          className="field-sizing-content max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="icon-lg"
          disabled={!canSend}
          aria-label="Send"
          className="size-10 shrink-0 rounded-full"
        >
          <SendHorizontal aria-hidden="true" />
        </Button>
      </div>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Keyboard className="size-3.5" aria-hidden="true" />
        Press Enter to send
      </p>
    </form>
  );
}
