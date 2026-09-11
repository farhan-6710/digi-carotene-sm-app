import type { ChatTabId } from "@/features/chat/constants/chatConfig";
import { CHAT_CONFIG } from "@/features/chat/constants/chatConfig";

export type ChatInboxDismissalKind = ChatTabId;

type DismissalsByKind = Record<ChatInboxDismissalKind, string[]>;

const EMPTY: DismissalsByKind = {
  projects: [],
  tasks: [],
  mentions: [],
};

function storageKey(actorKey: string): string {
  return `${CHAT_CONFIG.dismissals.storageKeyPrefix}:${actorKey}`;
}

export function readChatInboxDismissals(actorKey: string): DismissalsByKind {
  if (!actorKey) return { ...EMPTY, projects: [], tasks: [], mentions: [] };
  try {
    const raw = localStorage.getItem(storageKey(actorKey));
    if (!raw) return { projects: [], tasks: [], mentions: [] };
    const parsed = JSON.parse(raw) as Partial<DismissalsByKind>;
    return {
      projects: parsed.projects ?? [],
      tasks: parsed.tasks ?? [],
      mentions: parsed.mentions ?? [],
    };
  } catch {
    return { projects: [], tasks: [], mentions: [] };
  }
}

export function writeChatInboxDismissal(
  actorKey: string,
  kind: ChatInboxDismissalKind,
  itemId: string,
): DismissalsByKind {
  const current = readChatInboxDismissals(actorKey);
  if (current[kind].includes(itemId)) return current;

  const next: DismissalsByKind = {
    ...current,
    [kind]: [...current[kind], itemId],
  };

  try {
    localStorage.setItem(storageKey(actorKey), JSON.stringify(next));
  } catch {
    // Private mode — still return next for this session.
  }

  return next;
}
