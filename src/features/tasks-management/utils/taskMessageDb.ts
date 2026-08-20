import type {
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
  author_team_member_id: string;
  body: string;
  created_at: string;
  author: Rel<TaskMemberRef>;
};

export function mapTaskMessageRow(row: TaskMessageRow): TaskMessage {
  return {
    id: row.id,
    task_id: row.task_id,
    author_team_member_id: row.author_team_member_id,
    body: row.body,
    created_at: row.created_at,
    author: pickRelation(row.author),
  };
}
