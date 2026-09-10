import { useMemo, useState } from "react";

import {
  POST_STATUS_SELECT_ALL,
  type PostStatusSelectId,
} from "@/features/posts-management/constants/postStatusSelect";
import type { Post } from "@/features/posts-management/types/types";

export function useProjectPostsFilters(posts: Post[]) {
  const [statusFilter, setStatusFilter] = useState<PostStatusSelectId>(
    POST_STATUS_SELECT_ALL,
  );

  const filteredPosts = useMemo(() => {
    if (statusFilter === POST_STATUS_SELECT_ALL) {
      return posts;
    }
    return posts.filter((post) => post.status === statusFilter);
  }, [posts, statusFilter]);

  return {
    filteredPosts,
    statusFilter,
    setStatusFilter,
  };
}
