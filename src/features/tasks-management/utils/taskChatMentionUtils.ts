import {
  TASK_CHAT_MENTION_ROLES,
  type TaskChatMentionRole,
} from "@/features/tasks-management/constants/taskChatMentionRoles";
import type {
  Task,
  TaskMemberRef,
} from "@/features/tasks-management/types/types";

export type TaskChatParticipant = {
  id: string;
  member_name: string;
  roles: TaskChatMentionRole[];
};

type BuildTaskChatParticipantsOptions = {
  /** All team members with team_role = admin. */
  admins?: TaskMemberRef[];
  excludeMemberId?: string | null;
};

function sortRoles(roles: TaskChatMentionRole[]): TaskChatMentionRole[] {
  return TASK_CHAT_MENTION_ROLES.filter((role) => roles.includes(role));
}

/**
 * People who can be @mentioned in task chat:
 * raiser, assignee, dependencies, project manager, task client, and admins.
 * One person can carry multiple role labels (e.g. manager + admin).
 */
export function buildTaskChatParticipants(
  task: Task,
  options: BuildTaskChatParticipantsOptions = {},
): TaskChatParticipant[] {
  const { admins = [], excludeMemberId } = options;
  const byId = new Map<string, TaskChatParticipant>();

  const add = (
    member: TaskMemberRef | null | undefined,
    role: TaskChatMentionRole,
  ) => {
    if (!member?.id) return;
    if (excludeMemberId && member.id === excludeMemberId) return;

    const existing = byId.get(member.id);
    if (existing) {
      if (!existing.roles.includes(role)) {
        existing.roles = sortRoles([...existing.roles, role]);
      }
      return;
    }

    byId.set(member.id, {
      id: member.id,
      member_name: member.member_name,
      roles: [role],
    });
  };

  add(task.created_by, "raiser");
  add(task.assigned_to, "assignee");
  for (const member of task.tagged_members) {
    add(member, "dependency");
  }
  add(task.projects?.manager ?? null, "manager");

  if (task.client && !task.assigned_to_team_member_id) {
    add({ id: task.client.id, member_name: task.client.client_name }, "assignee");
    add({ id: task.client.id, member_name: task.client.client_name }, "client");
  } else if (task.client) {
    add({ id: task.client.id, member_name: task.client.client_name }, "client");
  }

  for (const admin of admins) {
    add(admin, "admin");
  }

  return [...byId.values()].sort((a, b) =>
    a.member_name.localeCompare(b.member_name),
  );
}

export type ActiveMention = {
  /** Start index of the `@` in the draft. */
  startIndex: number;
  /** Text typed after `@` (may be empty). */
  query: string;
};

/** Detect an open `@mention` at the caret (no whitespace after `@`). */
export function getActiveMention(
  text: string,
  cursorIndex: number,
): ActiveMention | null {
  const before = text.slice(0, cursorIndex);
  const atIndex = before.lastIndexOf("@");
  if (atIndex < 0) return null;

  if (atIndex > 0) {
    const charBefore = before[atIndex - 1];
    if (charBefore && !/\s/.test(charBefore)) return null;
  }

  const query = before.slice(atIndex + 1);
  if (/\s/.test(query)) return null;

  return { startIndex: atIndex, query };
}

export function filterMentionParticipants(
  participants: TaskChatParticipant[],
  query: string,
): TaskChatParticipant[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return participants;
  return participants.filter((member) =>
    member.member_name.toLowerCase().includes(normalized),
  );
}

export function insertMention(
  text: string,
  cursorIndex: number,
  mention: ActiveMention,
  memberName: string,
): { nextText: string; nextCursor: number } {
  const before = text.slice(0, mention.startIndex);
  const after = text.slice(cursorIndex);
  const inserted = `@${memberName} `;
  const nextText = `${before}${inserted}${after}`;
  const nextCursor = before.length + inserted.length;
  return { nextText, nextCursor };
}

/** Split message body so `@Name` tokens can be highlighted. */
export function splitMessageWithMentions(
  body: string,
  participantNames: string[],
): Array<{ text: string; isMention: boolean }> {
  if (!body || participantNames.length === 0) {
    return [{ text: body, isMention: false }];
  }

  const escaped = [...participantNames]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(
    `(@(?:${escaped.join("|")}))(?=\\s|$|[.,!?;:])`,
    "g",
  );

  const parts: Array<{ text: string; isMention: boolean }> = [];
  let lastIndex = 0;
  for (const match of body.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: body.slice(lastIndex, index), isMention: false });
    }
    parts.push({ text: match[1] ?? match[0], isMention: true });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < body.length) {
    parts.push({ text: body.slice(lastIndex), isMention: false });
  }
  return parts.length > 0 ? parts : [{ text: body, isMention: false }];
}
