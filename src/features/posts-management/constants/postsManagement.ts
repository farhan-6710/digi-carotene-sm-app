import type { StatusKey } from "@/features/posts-management/types/types";

export type SocialPlatform = "Instagram" | "Facebook" | "LinkedIn" | "YouTube";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
];

export const platformColors: Record<SocialPlatform, string> = {
  Instagram: "bg-pink-500",
  Facebook: "bg-blue-600",
  LinkedIn: "bg-sky-700",
  YouTube: "bg-red-600",
};

export const platformText: Record<SocialPlatform, string> = {
  Instagram: "text-pink-500",
  Facebook: "text-blue-600",
  LinkedIn: "text-sky-700",
  YouTube: "text-red-600",
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
