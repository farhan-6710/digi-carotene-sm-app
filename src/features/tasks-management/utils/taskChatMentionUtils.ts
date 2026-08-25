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

export type TaskChatSubtaskOption = {
  id: string;
  title: string;
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
 * raiser, assignees, dependencies, project manager, task client, and admins.
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
  for (const assignee of task.assignees) {
    if (assignee.team_member) add(assignee.team_member, "assignee");
    if (assignee.client) {
      add(
        { id: assignee.client.id, member_name: assignee.client.client_name },
        "assignee",
      );
      add(
        { id: assignee.client.id, member_name: assignee.client.client_name },
        "client",
      );
    }
  }
  for (const member of task.tagged_members) {
    add(member, "dependency");
  }
  if (task.dependency_client) {
    add(
      {
        id: task.dependency_client.id,
        member_name: task.dependency_client.client_name,
      },
      "dependency",
    );
  }
  add(task.projects?.manager ?? null, "manager");

  if (task.client && !task.assignees.some((row) => row.client_id === task.client_id)) {
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
  /** Start index of the `@` or `/` in the draft. */
  startIndex: number;
  /** Text typed after the trigger (may be empty). */
  query: string;
  kind: "person" | "subtask";
};

function getActiveTriggerMention(
  text: string,
  cursorIndex: number,
  trigger: "@" | "/",
  kind: ActiveMention["kind"],
): ActiveMention | null {
  const before = text.slice(0, cursorIndex);
  const triggerIndex = before.lastIndexOf(trigger);
  if (triggerIndex < 0) return null;

  if (triggerIndex > 0) {
    const charBefore = before[triggerIndex - 1];
    if (charBefore && !/\s/.test(charBefore)) return null;
  }

  const query = before.slice(triggerIndex + 1);
  if (/\s/.test(query)) return null;

  return { startIndex: triggerIndex, query, kind };
}

/** Detect an open `@mention` at the caret (no whitespace after `@`). */
export function getActiveMention(
  text: string,
  cursorIndex: number,
): ActiveMention | null {
  const atMention = getActiveTriggerMention(text, cursorIndex, "@", "person");
  const slashMention = getActiveTriggerMention(
    text,
    cursorIndex,
    "/",
    "subtask",
  );

  if (atMention && slashMention) {
    return atMention.startIndex >= slashMention.startIndex
      ? atMention
      : slashMention;
  }
  return atMention ?? slashMention;
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

export function filterSubtaskMentionOptions(
  subtasks: TaskChatSubtaskOption[],
  query: string,
): TaskChatSubtaskOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return subtasks;
  return subtasks.filter((subtask) =>
    subtask.title.toLowerCase().includes(normalized),
  );
}

export function insertMention(
  text: string,
  cursorIndex: number,
  mention: ActiveMention,
  label: string,
): { nextText: string; nextCursor: number } {
  const before = text.slice(0, mention.startIndex);
  const after = text.slice(cursorIndex);
  const prefix = mention.kind === "subtask" ? "/" : "@";
  const inserted = `${prefix}${label} `;
  const nextText = `${before}${inserted}${after}`;
  const nextCursor = before.length + inserted.length;
  return { nextText, nextCursor };
}

type MessagePart = {
  text: string;
  isMention: boolean;
  isSubtaskMention?: boolean;
};

/** Split message body so `@Name` and `/Title` tokens can be highlighted. */
export function splitMessageWithMentions(
  body: string,
  participantNames: string[],
  subtaskTitles: string[] = [],
): MessagePart[] {
  if (!body) return [{ text: body, isMention: false }];

  const personEscaped = [...participantNames]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const subtaskEscaped = [...subtaskTitles]
    .sort((a, b) => b.length - a.length)
    .map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const patterns: Array<{
    regex: RegExp;
    isSubtaskMention: boolean;
  }> = [];

  if (personEscaped.length > 0) {
    patterns.push({
      regex: new RegExp(
        `(@(?:${personEscaped.join("|")}))(?=\\s|$|[.,!?;:])`,
        "g",
      ),
      isSubtaskMention: false,
    });
  }
  if (subtaskEscaped.length > 0) {
    patterns.push({
      regex: new RegExp(
        `(/(?:${subtaskEscaped.join("|")}))(?=\\s|$|[.,!?;:])`,
        "g",
      ),
      isSubtaskMention: true,
    });
  }

  if (patterns.length === 0) {
    return [{ text: body, isMention: false }];
  }

  type Hit = {
    index: number;
    length: number;
    text: string;
    isSubtaskMention: boolean;
  };

  const hits: Hit[] = [];
  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern.regex)) {
      hits.push({
        index: match.index ?? 0,
        length: match[0].length,
        text: match[1] ?? match[0],
        isSubtaskMention: pattern.isSubtaskMention,
      });
    }
  }

  hits.sort((a, b) => a.index - b.index || b.length - a.length);

  const parts: MessagePart[] = [];
  let lastIndex = 0;
  for (const hit of hits) {
    if (hit.index < lastIndex) continue;
    if (hit.index > lastIndex) {
      parts.push({ text: body.slice(lastIndex, hit.index), isMention: false });
    }
    parts.push({
      text: hit.text,
      isMention: true,
      isSubtaskMention: hit.isSubtaskMention,
    });
    lastIndex = hit.index + hit.length;
  }
  if (lastIndex < body.length) {
    parts.push({ text: body.slice(lastIndex), isMention: false });
  }
  return parts.length > 0 ? parts : [{ text: body, isMention: false }];
}
