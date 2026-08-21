export const TASK_CHAT_MENTION_ROLES = [
  "raiser",
  "assignee",
  "manager",
  "dependency",
  "admin",
  "client",
] as const;

export type TaskChatMentionRole = (typeof TASK_CHAT_MENTION_ROLES)[number];

export const TASK_CHAT_MENTION_ROLE_LABELS: Record<TaskChatMentionRole, string> =
  {
    raiser: "Raiser",
    assignee: "Assignee",
    manager: "Manager",
    dependency: "Dependency",
    admin: "Admin",
    client: "Client",
  };

/** Client portal: the logged-in brand sees "Myself", not "Client". */
export function taskChatMentionRoleLabel(
  role: TaskChatMentionRole,
  options: { isClientPortal?: boolean } = {},
): string {
  if (role === "client" && options.isClientPortal) return "Myself";
  return TASK_CHAT_MENTION_ROLE_LABELS[role];
}
