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

export const statusOptions: StatusKey[] = ["Not posted", "Scheduled", "Posted"];

export const DEFAULT_POST_STATUS: StatusKey = "Not posted";

export const statusColors: Record<StatusKey, string> = {
  "Not posted": "bg-status-not-posted",
  Scheduled: "bg-status-scheduled",
  Posted: "bg-status-posted",
};

export const statusText: Record<StatusKey, string> = {
  "Not posted": "text-status-not-posted",
  Scheduled: "text-status-scheduled",
  Posted: "text-status-posted",
};

export const statusBadgeStyles: Record<StatusKey, string> = {
  "Not posted":
    "border border-status-not-posted/50 bg-status-not-posted/15 text-status-not-posted ring-1 ring-status-not-posted/20",
  Scheduled:
    "border border-status-scheduled/50 bg-status-scheduled/15 text-status-scheduled ring-1 ring-status-scheduled/20",
  Posted:
    "border border-status-posted/50 bg-status-posted/15 text-status-posted ring-1 ring-status-posted/20",
};
