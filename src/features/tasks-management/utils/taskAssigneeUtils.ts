export type TaskAssigneeKind = "team" | "client";

export type TaskAssigneeSelection = {
  kind: TaskAssigneeKind;
  id: string;
};

const TEAM_PREFIX = "team:";
const CLIENT_PREFIX = "client:";

export function encodeTaskAssignee(
  kind: TaskAssigneeKind,
  id: string,
): string {
  return `${kind === "team" ? TEAM_PREFIX : CLIENT_PREFIX}${id}`;
}

export function parseTaskAssignee(
  value: string,
): TaskAssigneeSelection | null {
  if (value.startsWith(TEAM_PREFIX)) {
    const id = value.slice(TEAM_PREFIX.length);
    return id ? { kind: "team", id } : null;
  }
  if (value.startsWith(CLIENT_PREFIX)) {
    const id = value.slice(CLIENT_PREFIX.length);
    return id ? { kind: "client", id } : null;
  }
  return null;
}
