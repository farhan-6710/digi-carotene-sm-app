import type { Post, StatusKey } from "@/features/posts-management/types/types";

export type ProjectPostStats = {
  total: number;
  posted: number;
  scheduled: number;
  notPosted: number;
};

function countByStatus(posts: Post[], status: StatusKey): number {
  return posts.filter((post) => post.status === status).length;
}

export function buildProjectPostStats(posts: Post[]): ProjectPostStats {
  return {
    total: posts.length,
    posted: countByStatus(posts, "Posted"),
    scheduled: countByStatus(posts, "Scheduled"),
    notPosted: countByStatus(posts, "Not posted"),
  };
}
