import type { POST_APPROVAL_REQUEST_STATUSES } from "@/features/post-approvals/constants/postApprovals";
import type {
  PostType,
  StatusKey,
  PostLinks,
} from "@/features/posts-management/types/types";

export type PostApprovalRequestStatus =
  (typeof POST_APPROVAL_REQUEST_STATUSES)[number];

export type PostApprovalPayload = {
  projectId: string;
  postTitle: string | null;
  postType: PostType;
  socials: string[] | null;
  postLinks: PostLinks | null;
  toBePostedOn: { date: string; time: string };
  posted: { date: string; time: string } | null;
  status: StatusKey;
};

export type PostApprovalRequest = {
  id: string;
  status: PostApprovalRequestStatus;
  project_id: string;
  project_name: string | null;
  client_name: string | null;
  project_manager_id: string;
  requested_by_team_member_id: string;
  requested_by_name: string | null;
  reviewed_by_team_member_id: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  approved_post_id: string | null;
  post_payload: PostApprovalPayload;
  created_at: string;
};

export type CreatePostApprovalRequestInput = PostApprovalPayload;
