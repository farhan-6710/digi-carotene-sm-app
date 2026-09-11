export type ProjectMessage = {
  id: string;
  sm_project_id: string;
  author_team_member_id: string | null;
  author_client_id: string | null;
  body: string;
  mentioned_team_member_ids: string[];
  mentioned_client_ids: string[];
  created_at: string;
  author: { id: string; member_name: string } | null;
  author_client: { id: string; client_name: string } | null;
};
