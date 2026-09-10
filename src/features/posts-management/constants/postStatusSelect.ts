import type { StatusKey } from "@/features/posts-management/types/types";
import { statusOptions } from "@/features/posts-management/constants/postsManagement";

export const POST_STATUS_SELECT_ALL = "all" as const;

export type PostStatusSelectId = typeof POST_STATUS_SELECT_ALL | StatusKey;

export const POST_STATUS_SELECT_OPTIONS: PostStatusSelectId[] = [
  POST_STATUS_SELECT_ALL,
  ...statusOptions,
];

export const POST_STATUS_SELECT_LABELS: Record<PostStatusSelectId, string> = {
  all: "All Posts",
  "Not posted": "Not posted",
  Scheduled: "Scheduled",
  Posted: "Posted",
};
