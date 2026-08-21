import type {
  TaskClientRef,
  TaskMemberRef,
  TaskMessage,
} from "@/features/tasks-management/types/types";

type Rel<T> = T | T[] | null | undefined;

function pickRelation<T>(value: Rel<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export type TaskMessageRow = {
  id: string;
  task_id: string;
  author_team_member_id: string | null;
  author_client_id: string | null;
  body: string;
  created_at: string;
  author: Rel<TaskMemberRef>;
  author_client: Rel<TaskClientRef>;
};

export function mapTaskMessageRow(row: TaskMessageRow): TaskMessage {
  return {
    id: row.id,
    task_id: row.task_id,
    author_team_member_id: row.author_team_member_id,
    author_client_id: row.author_client_id,
    body: row.body,
    created_at: row.created_at,
    author: pickRelation(row.author),
    author_client: pickRelation(row.author_client),
  };
}

export function taskMessageAuthorLabel(message: TaskMessage): string {
  if (message.author?.member_name) return message.author.member_name;
  if (message.author_client?.client_name) {
    return message.author_client.client_name;
  }
  return "Someone";
}
