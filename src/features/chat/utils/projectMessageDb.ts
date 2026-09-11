import type { ProjectMessage } from "@/features/chat/types/projectMessage";

type Rel<T> = T | T[] | null | undefined;

function pickRelation<T>(value: Rel<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export type ProjectMessageRow = {
  id: string;
  sm_project_id: string;
  author_team_member_id: string | null;
  author_client_id: string | null;
  body: string;
  mentioned_team_member_ids?: string[] | null;
  mentioned_client_ids?: string[] | null;
  created_at: string;
  author: Rel<{ id: string; member_name: string }>;
  author_client: Rel<{ id: string; client_name: string }>;
};

export function mapProjectMessageRow(row: ProjectMessageRow): ProjectMessage {
  return {
    id: row.id,
    sm_project_id: row.sm_project_id,
    author_team_member_id: row.author_team_member_id,
    author_client_id: row.author_client_id,
    body: row.body,
    mentioned_team_member_ids: row.mentioned_team_member_ids ?? [],
    mentioned_client_ids: row.mentioned_client_ids ?? [],
    created_at: row.created_at,
    author: pickRelation(row.author),
    author_client: pickRelation(row.author_client),
  };
}
