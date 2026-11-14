import { AssistantMark } from "./AssistantMark";
import {
  ASSISTANT_NAME,
  ASSISTANT_SUGGESTIONS,
} from "../constants/assistantSuggestions";
import type { AssistantWelcomeProps } from "../types/components";

/** Empty state: who Pulse is, and starter analysis questions. */
export function AssistantWelcome({ name, onAsk }: AssistantWelcomeProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative z-10 flex flex-col items-center px-6 pt-8 text-center">
        <span className="grid size-20 animate-message-in place-items-center rounded-3xl border border-border bg-card text-primary shadow-md">
          <AssistantMark className="size-11" active />
        </span>
        <h2 className="mt-6 text-3xl leading-tight">
          Hello, <span className="text-primary">{name || "there"}!</span>
        </h2>
        <p className="mt-2 max-w-[19rem] text-sm leading-relaxed text-muted-foreground">
          I&apos;m {ASSISTANT_NAME}, your paid-ads analyst. Ask about campaigns,
          ad sets, or ads — patterns, verdicts, and what to try next.
        </p>
      </div>

      <ul className="mt-8 space-y-2.5 px-5 pb-4" aria-label="Suggested questions">
        {ASSISTANT_SUGGESTIONS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onAsk(label)}
              className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-border bg-card/80 py-1.5 pr-4 pl-1.5 text-sm shadow-xs transition-colors hover:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="grid size-7 place-items-center rounded-full bg-muted text-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
