import { POST_APPROVALS_UPDATED_EVENT } from "@/features/post-approvals/constants/postApprovals";

export function notifyPostApprovalsUpdated() {
  window.dispatchEvent(new Event(POST_APPROVALS_UPDATED_EVENT));
}
