import type {
  PostApprovalPayload,
  PostApprovalRequest,
} from "@/features/post-approvals/types/types";

type PostApprovalRequestRow = {
  id: string;
  status: PostApprovalRequest["status"];
  project_id: string;
  requested_by_team_member_id: string;
  reviewed_by_team_member_id: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  approved_post_id: string | null;
  post_payload: PostApprovalPayload;
  created_at: string;
  projects:
    | {
        project_name: string;
        manager_id: string;
        clients: { client_name: string } | { client_name: string }[] | null;
      }
    | {
        project_name: string;
        manager_id: string;
        clients: { client_name: string } | { client_name: string }[] | null;
      }[]
    | null;
  requester:
    | { member_name: string }
    | { member_name: string }[]
    | null;
};

export function mapDbRowToPostApprovalRequest(
  row: PostApprovalRequestRow,
): PostApprovalRequest {
  const project = Array.isArray(row.projects) ? row.projects[0] ?? null : row.projects;
  const client = project?.clients
    ? Array.isArray(project.clients)
      ? project.clients[0] ?? null
      : project.clients
    : null;
  const requester = Array.isArray(row.requester) ? row.requester[0] ?? null : row.requester;

  return {
    id: row.id,
    status: row.status,
    project_id: row.project_id,
    project_name: project?.project_name ?? null,
    client_name: client?.client_name ?? null,
    project_manager_id: project?.manager_id ?? "",
    requested_by_team_member_id: row.requested_by_team_member_id,
    requested_by_name: requester?.member_name ?? null,
    reviewed_by_team_member_id: row.reviewed_by_team_member_id,
    reviewed_at: row.reviewed_at,
    rejection_reason: row.rejection_reason,
    approved_post_id: row.approved_post_id,
    post_payload: row.post_payload,
    created_at: row.created_at,
  };
}
