import type { PostType, StatusKey } from "@/features/posts-management/types/types";

export type SocialPlatform =
  | "Instagram"
  | "Facebook"
  | "LinkedIn"
  | "YouTube"
  | "Google";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Google",
];

export const platformColors: Record<SocialPlatform, string> = {
  Instagram: "bg-pink-500",
  Facebook: "bg-blue-600",
  LinkedIn: "bg-sky-700",
  YouTube: "bg-red-600",
  Google: "bg-[#4285F4]",
};

export const platformText: Record<SocialPlatform, string> = {
  Instagram: "text-pink-500",
  Facebook: "text-blue-600",
  LinkedIn: "text-sky-700",
  YouTube: "text-red-600",
  Google: "text-[#4285F4]",
};

export const POST_TYPES: PostType[] = [
  "single_post",
  "carousel",
  "reel",
  "story",
  "video",
];

export const DEFAULT_POST_TYPE: PostType = "single_post";

export const postTypeLabels: Record<PostType, string> = {
  single_post: "Single Post",
  carousel: "Carousel",
  reel: "Reel",
  story: "Story",
  video: "Video",
};

export const statusOptions: StatusKey[] = [
  "editing",
  "sent_for_approval",
  "changes_suggested",
  "approved",
  "scheduled",
  "posted",
];

export const DEFAULT_POST_STATUS: StatusKey = "editing";

export const statusLabels: Record<StatusKey, string> = {
  editing: "Editing",
  sent_for_approval: "Sent for approval",
  changes_suggested: "Changes suggested",
  approved: "Approved",
  scheduled: "Scheduled",
  posted: "Posted",
};

export const statusColors: Record<StatusKey, string> = {
  editing: "bg-status-editing",
  sent_for_approval: "bg-status-sent-for-approval",
  changes_suggested: "bg-status-changes-suggested",
  approved: "bg-status-approved",
  scheduled: "bg-status-scheduled",
  posted: "bg-status-posted",
};

export const statusText: Record<StatusKey, string> = {
  editing: "text-status-editing",
  sent_for_approval: "text-status-sent-for-approval",
  changes_suggested: "text-status-changes-suggested",
  approved: "text-status-approved",
  scheduled: "text-status-scheduled",
  posted: "text-status-posted",
};

export const statusBadgeStyles: Record<StatusKey, string> = {
  editing:
    "border border-status-editing/50 bg-status-editing/15 text-status-editing ring-1 ring-status-editing/20",
  sent_for_approval:
    "border border-status-sent-for-approval/50 bg-status-sent-for-approval/15 text-status-sent-for-approval ring-1 ring-status-sent-for-approval/20",
  changes_suggested:
    "border border-status-changes-suggested/50 bg-status-changes-suggested/15 text-status-changes-suggested ring-1 ring-status-changes-suggested/20",
  approved:
    "border border-status-approved/50 bg-status-approved/15 text-status-approved ring-1 ring-status-approved/20",
  scheduled:
    "border border-status-scheduled/50 bg-status-scheduled/15 text-status-scheduled ring-1 ring-status-scheduled/20",
  posted:
    "border border-status-posted/50 bg-status-posted/15 text-status-posted ring-1 ring-status-posted/20",
};
