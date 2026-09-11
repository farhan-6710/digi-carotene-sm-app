export type ChatMentionKind = "team" | "client";

export type ChatMentionTarget = {
  id: string;
  name: string;
  kind: ChatMentionKind;
};

export type ExtractedChatMentions = {
  mentionedTeamMemberIds: string[];
  mentionedClientIds: string[];
};

/**
 * Resolve `@Name` tokens in a message body to participant ids.
 * Longest name wins when names overlap.
 */
export function extractMentionedIds(
  body: string,
  targets: ChatMentionTarget[],
): ExtractedChatMentions {
  const mentionedTeamMemberIds = new Set<string>();
  const mentionedClientIds = new Set<string>();

  if (!body.trim() || targets.length === 0) {
    return { mentionedTeamMemberIds: [], mentionedClientIds: [] };
  }

  const sorted = [...targets].sort((a, b) => b.name.length - a.name.length);
  const escaped = sorted.map((target) =>
    target.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(
    `@(?:${escaped.join("|")})(?=\\s|$|[.,!?;:])`,
    "g",
  );

  for (const match of body.matchAll(regex)) {
    const token = match[0].slice(1);
    const target = sorted.find((item) => item.name === token);
    if (!target) continue;
    if (target.kind === "client") {
      mentionedClientIds.add(target.id);
    } else {
      mentionedTeamMemberIds.add(target.id);
    }
  }

  return {
    mentionedTeamMemberIds: [...mentionedTeamMemberIds],
    mentionedClientIds: [...mentionedClientIds],
  };
}
