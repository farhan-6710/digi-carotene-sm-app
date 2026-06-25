import { format } from "date-fns";

import type { PostApprovalRequest } from "@/features/post-approvals/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";

export function formatApprovalPostingTimeLabel(
  request: PostApprovalRequest,
): string {
  const { date, time } = request.post_payload.toBePostedOn;
  const postingAt = parseDateTime(date, time);

  if (!postingAt) {
    return `${date} · ${time}`;
  }

  return format(postingAt, "MMM d, yyyy · h:mm a");
}

export function formatApprovalPostLabel(request: PostApprovalRequest): string {
  const projectName = request.project_name ?? "Unknown project";
  const postTitle = request.post_payload.postTitle?.trim();

  return postTitle ? `${projectName} — ${postTitle}` : projectName;
}

export function formatApprovalProjectLabel(request: PostApprovalRequest): string {
  if (request.client_name) {
    return `${request.project_name ?? "Unknown project"} (${request.client_name})`;
  }

  return request.project_name ?? "Unknown project";
}
