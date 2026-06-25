import type {
  CreatePostApprovalRequestInput,
  PostApprovalRequest,
} from "@/features/post-approvals/types/types";
import { mapDbRowToPostApprovalRequest } from "@/features/post-approvals/utils/postApprovalDb";
import { canReviewPostApprovalRequest } from "@/features/post-approvals/utils/postApprovalRules";
import { notifyPostApprovalsUpdated } from "@/features/post-approvals/utils/postApprovalsEvents";
import { createPost } from "@/features/posts-management/utils/postsRepository";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { supabase } from "@/shared/lib/supabase";

const approvalSelect = `
  id,
  status,
  project_id,
  requested_by_team_member_id,
  reviewed_by_team_member_id,
  reviewed_at,
  rejection_reason,
  approved_post_id,
  post_payload,
  created_at,
  projects (
    project_name,
    manager_id,
    clients ( client_name )
  ),
  requester:team_members!requested_by_team_member_id (
    member_name
  )
`;

function filterReviewableRequests(
  requests: PostApprovalRequest[],
  teamMemberId: string,
  teamRole: TeamMemberRole,
): PostApprovalRequest[] {
  return requests.filter((request) =>
    canReviewPostApprovalRequest(
      teamRole,
      teamMemberId,
      request.project_manager_id,
    ),
  );
}

export async function createPostApprovalRequest(
  input: CreatePostApprovalRequestInput,
  requestedByTeamMemberId: string,
): Promise<PostApprovalRequest> {
  const { data, error } = await supabase
    .from("post_approval_requests")
    .insert({
      status: "pending",
      project_id: input.projectId,
      requested_by_team_member_id: requestedByTeamMemberId,
      post_payload: input,
    })
    .select(approvalSelect)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to submit approval request.");
  }

  notifyPostApprovalsUpdated();
  return mapDbRowToPostApprovalRequest(data);
}

export async function fetchPendingApprovalsForReviewer(
  teamMemberId: string,
  teamRole: TeamMemberRole,
): Promise<PostApprovalRequest[]> {
  const { data, error } = await supabase
    .from("post_approval_requests")
    .select(approvalSelect)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const requests = (data ?? []).map((row) =>
    mapDbRowToPostApprovalRequest(row),
  );

  return filterReviewableRequests(requests, teamMemberId, teamRole);
}

export async function countPendingApprovalsForReviewer(
  teamMemberId: string,
  teamRole: TeamMemberRole,
): Promise<number> {
  const requests = await fetchPendingApprovalsForReviewer(teamMemberId, teamRole);
  return requests.length;
}

export async function approvePostApprovalRequest(
  requestId: string,
  reviewerTeamMemberId: string,
): Promise<PostApprovalRequest> {
  const { data: existing, error: fetchError } = await supabase
    .from("post_approval_requests")
    .select(approvalSelect)
    .eq("id", requestId)
    .eq("status", "pending")
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message ?? "Failed to load approval request.");
  }

  if (!existing) {
    throw new Error("Approval request is no longer pending.");
  }

  const request = mapDbRowToPostApprovalRequest(existing);
  const payload = request.post_payload;

  const post = await createPost({
    projectId: payload.projectId,
    postTitle: payload.postTitle,
    socials: payload.socials,
    postLinks: payload.postLinks,
    toBePostedOn: payload.toBePostedOn,
    posted: payload.posted,
    status: payload.status,
  });

  const { data, error } = await supabase
    .from("post_approval_requests")
    .update({
      status: "approved",
      reviewed_by_team_member_id: reviewerTeamMemberId,
      reviewed_at: new Date().toISOString(),
      approved_post_id: post.id,
    })
    .eq("id", requestId)
    .eq("status", "pending")
    .select(approvalSelect)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to approve request.");
  }

  notifyPostApprovalsUpdated();
  return mapDbRowToPostApprovalRequest(data);
}

export async function rejectPostApprovalRequest(
  requestId: string,
  reviewerTeamMemberId: string,
  rejectionReason?: string,
): Promise<PostApprovalRequest> {
  const { data, error } = await supabase
    .from("post_approval_requests")
    .update({
      status: "rejected",
      reviewed_by_team_member_id: reviewerTeamMemberId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason?.trim() || null,
    })
    .eq("id", requestId)
    .eq("status", "pending")
    .select(approvalSelect)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to reject request.");
  }

  notifyPostApprovalsUpdated();
  return mapDbRowToPostApprovalRequest(data);
}

export async function managesAnyProject(teamMemberId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("manager_id", teamMemberId);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}
