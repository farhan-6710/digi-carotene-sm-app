import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import { createPost } from "@/services/postsService";
import {
  createNotifications,
  markNotificationsReadByRelatedId,
} from "@/services/notificationsService";
import type {
  CreatePostApprovalRequestInput,
  PostApprovalRequest,
} from "@/features/post-approvals/types/types";
import { mapDbRowToPostApprovalRequest } from "@/features/post-approvals/utils/postApprovalDb";
import { canReviewPostApprovalRequest } from "@/features/post-approvals/utils/postApprovalRules";
import { notifyPostApprovalsUpdated } from "@/features/post-approvals/utils/postApprovalsEvents";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

async function fetchAdminTeamMemberIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select("id")
    .eq("team_role", "admin");

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => (typeof row.id === "string" ? row.id : ""))
    .filter((id) => id !== "");
}

async function createApprovalNotifications(
  request: PostApprovalRequest,
): Promise<void> {
  const adminIds = await fetchAdminTeamMemberIds();
  const recipientIds = new Set<string>(adminIds);

  if (request.project_manager_id) {
    recipientIds.add(request.project_manager_id);
  }

  recipientIds.delete(request.requested_by_team_member_id);

  const requesterName = request.requested_by_name ?? "A teammate";
  const projectLabel =
    request.client_name && request.project_name
      ? `${request.client_name} · ${request.project_name}`
      : (request.project_name ?? "a project");
  const postLabel = request.post_payload.postTitle?.trim() || "Untitled post";

  await createNotifications(
    [...recipientIds].map((recipientTeamMemberId) => ({
      recipientTeamMemberId,
      notificationType: "approval" as const,
      title: "Post approval requested",
      message: `${requesterName} requested approval for “${postLabel}” on ${projectLabel}.`,
      relatedId: request.id,
    })),
  );
}

export async function createPostApprovalRequest(
  input: CreatePostApprovalRequestInput,
  requestedByTeamMemberId: string,
): Promise<PostApprovalRequest> {
  const { data, error } = await supabase
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .insert({
      status: "pending",
      project_id: input.projectId,
      requested_by_team_member_id: requestedByTeamMemberId,
      post_payload: input,
    })
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to submit approval request.");
  }

  const request = mapDbRowToPostApprovalRequest(data);

  try {
    await createApprovalNotifications(request);
  } catch {
    // Approval request already saved; inbox alert is best-effort for V1.
  }

  notifyPostApprovalsUpdated();
  return request;
}

export async function fetchPendingApprovalsForReviewer(
  teamMemberId: string,
  teamRole: TeamMemberRole,
): Promise<PostApprovalRequest[]> {
  const { data, error } = await supabase
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const requests = (data ?? []).map((row) => mapDbRowToPostApprovalRequest(row));

  return requests.filter((request) =>
    canReviewPostApprovalRequest(teamRole, teamMemberId, request.project_manager_id),
  );
}

export async function fetchPendingApprovalsByIds(
  requestIds: string[],
): Promise<PostApprovalRequest[]> {
  if (requestIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .in("id", requestIds)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapDbRowToPostApprovalRequest(row));
}

export async function countPendingApprovalsForReviewer(
  teamMemberId: string,
  teamRole: TeamMemberRole,
): Promise<number> {
  if (teamRole === "admin") {
    const { count, error } = await supabase
      .from(DB.POST_APPROVAL_REQUESTS.TABLE)
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) {
      throw error;
    }

    return count ?? 0;
  }

  if (teamRole === "manager") {
    const { count, error } = await supabase
      .from(DB.POST_APPROVAL_REQUESTS.TABLE)
      .select("id, projects!inner(manager_id)", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("projects.manager_id", teamMemberId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  }

  return 0;
}

export async function managesAnyProject(teamMemberId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("id", { count: "exact", head: true })
    .eq("manager_id", teamMemberId);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function approvePostApprovalRequest(
  requestId: string,
  reviewerTeamMemberId: string,
): Promise<PostApprovalRequest> {
  const { data: existing, error: fetchError } = await supabase
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .eq("id", requestId)
    .eq("status", "pending")
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message ?? "Failed to load approval request.");
  }

  if (!existing) {
    throw new Error("Approval request is no longer pending.");
  }

  const payload = mapDbRowToPostApprovalRequest(existing).post_payload;
  const post = await createPost(payload);

  const { data, error } = await supabase
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .update({
      status: "approved",
      reviewed_by_team_member_id: reviewerTeamMemberId,
      reviewed_at: new Date().toISOString(),
      approved_post_id: post.id,
    })
    .eq("id", requestId)
    .eq("status", "pending")
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to approve request.");
  }

  try {
    await markNotificationsReadByRelatedId(requestId);
  } catch {
    // Review succeeded; clearing inbox is best-effort.
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
    .from(DB.POST_APPROVAL_REQUESTS.TABLE)
    .update({
      status: "rejected",
      reviewed_by_team_member_id: reviewerTeamMemberId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason?.trim() || null,
    })
    .eq("id", requestId)
    .eq("status", "pending")
    .select(DB.POST_APPROVAL_REQUESTS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message ?? "Failed to reject request.");
  }

  try {
    await markNotificationsReadByRelatedId(requestId);
  } catch {
    // Review succeeded; clearing inbox is best-effort.
  }

  notifyPostApprovalsUpdated();
  return mapDbRowToPostApprovalRequest(data);
}
