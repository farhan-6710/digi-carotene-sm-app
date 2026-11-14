import type {
  AssistantContent,
  AssistantMessage,
} from "@/shared/types/assistant";

const STORAGE_KEY = "digi-carotene-pulse-chat";

export type AssistantSessionState = {
  messages: AssistantMessage[];
  history: AssistantContent[];
  analyzedKey: string | null;
};

const EMPTY: AssistantSessionState = {
  messages: [],
  history: [],
  analyzedKey: null,
};

/** Per-tab chat: survives reload, cleared when the tab/session closes. */
export function loadAssistantSession(): AssistantSessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AssistantSessionState>;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      analyzedKey:
        typeof parsed.analyzedKey === "string" ? parsed.analyzedKey : null,
    };
  } catch {
    return EMPTY;
  }
}

export function saveAssistantSession(state: AssistantSessionState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota / private mode — chat still works in memory.
  }
}

export function clearAssistantSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
