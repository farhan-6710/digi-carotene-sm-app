import type {
  AssistantContent,
  AssistantMessage,
} from "@/shared/types/assistant";

const STORAGE_KEY = "digi-carotene-pulse-chats";

export type AssistantSessionState = {
  messages: AssistantMessage[];
  history: AssistantContent[];
};

type SessionStore = {
  sessions: Record<string, AssistantSessionState>;
};

const EMPTY: AssistantSessionState = {
  messages: [],
  history: [],
};

function readStore(): SessionStore {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: {} };
    const parsed = JSON.parse(raw) as Partial<SessionStore>;
    if (!parsed.sessions || typeof parsed.sessions !== "object") {
      return { sessions: {} };
    }
    return { sessions: parsed.sessions };
  } catch {
    return { sessions: {} };
  }
}

function writeStore(store: SessionStore): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota / private mode — chat still works in memory.
  }
}

function normalizeSession(
  value: Partial<AssistantSessionState> | undefined,
): AssistantSessionState {
  if (!value) return EMPTY;
  return {
    messages: Array.isArray(value.messages) ? value.messages : [],
    history: Array.isArray(value.history) ? value.history : [],
  };
}

/** Per-tab, per-entity chat: survives reload, cleared when the tab closes. */
export function loadAssistantSession(scopeKey: string): AssistantSessionState {
  return normalizeSession(readStore().sessions[scopeKey]);
}

export function saveAssistantSession(
  scopeKey: string,
  state: AssistantSessionState,
): void {
  const store = readStore();
  store.sessions[scopeKey] = {
    messages: state.messages,
    history: state.history,
  };
  writeStore(store);
}

export function clearAssistantSession(scopeKey: string): void {
  const store = readStore();
  delete store.sessions[scopeKey];
  writeStore(store);
}
