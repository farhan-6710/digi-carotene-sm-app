import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw } from "lucide-react";

import { AssistantComposer } from "./AssistantComposer";
import { AssistantMark } from "./AssistantMark";
import { AssistantMessages } from "./AssistantMessages";
import { AssistantWelcome } from "./AssistantWelcome";
import {
  ASSISTANT_NAME,
  ASSISTANT_SHORTCUT_KEY,
} from "../constants/assistantSuggestions";
import { useAssistant } from "../hooks/useAssistant";
import type { AssistantStatus } from "../types/components";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/ui/sheet";

const STATUS_LABEL: Record<AssistantStatus, string> = {
  idle: "Online",
  thinking: "Analysing…",
  streaming: "Typing…",
};

function AssistantStatusLine({
  status,
  detail,
}: {
  status: AssistantStatus;
  detail: string | null;
}) {
  const label =
    detail && status !== "idle" ? detail : STATUS_LABEL[status];
  return (
    <SheetDescription className="mt-0.5 flex items-center gap-2 text-xs">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      <span aria-live="polite">{label}</span>
    </SheetDescription>
  );
}

/** Floating round trigger + sheet. Chat in sessionStorage; Learning auto-brief. */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const assistant = useAssistant();
  const hasChat = assistant.messages.length > 0;
  const isBusy = assistant.status !== "idle";

  useEffect(() => {
    assistant.setSheetOpen(open);
  }, [open, assistant.setSheetOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === ASSISTANT_SHORTCUT_KEY &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    assistant.setSheetOpen(next);
  }

  // Portal to body so `fixed` is viewport-relative (page motion uses transform).
  return createPortal(
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Button
        size="icon-lg"
        aria-label={`Open ${ASSISTANT_NAME} (⌘J)`}
        title={`${ASSISTANT_NAME} (⌘J)`}
        onClick={() => handleOpenChange(true)}
        className="fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-lg transition-transform hover:scale-105 sm:right-7 sm:bottom-7"
      >
        <AssistantMark className="size-7" active={isBusy} />
      </Button>

      <SheetContent className="w-full gap-0 overflow-hidden bg-background p-0 sm:inset-y-3 sm:right-3 sm:h-auto sm:max-w-md sm:rounded-2xl sm:border sm:shadow-xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4 pr-14">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-primary shadow-xs">
            <AssistantMark className="size-6" active={isBusy} />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-lg leading-tight">
              {ASSISTANT_NAME}
            </SheetTitle>
            <AssistantStatusLine
              status={assistant.status}
              detail={assistant.statusDetail}
            />
          </div>
          {hasChat ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={assistant.reset}
              aria-label="Start a new chat"
              className="text-muted-foreground"
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          ) : null}
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {hasChat ? (
            <AssistantMessages
              messages={assistant.messages}
              status={assistant.status}
              streamingId={assistant.streamingId}
              error={assistant.error}
              onNavigate={() => handleOpenChange(false)}
            />
          ) : (
            <AssistantWelcome
              name={assistant.displayName}
              onAsk={(question) => void assistant.ask(question)}
            />
          )}
        </div>

        <AssistantComposer
          disabled={isBusy}
          onSend={(question) => void assistant.ask(question)}
        />
      </SheetContent>
    </Sheet>,
    document.body,
  );
}
