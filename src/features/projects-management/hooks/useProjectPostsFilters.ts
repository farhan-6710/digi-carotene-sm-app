import { useCallback, useMemo, useState } from "react";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import type { Post } from "@/features/posts-management/types/types";
import {
  filterPostsByStatus,
  getDefaultPostStatusFilterState,
  togglePostStatusFilter,
  type PostStatusFilterTarget,
} from "@/shared/utils/postStatusFilterUtils";

export function useProjectPostsFilters(posts: Post[]) {
  const [statusFilter, setStatusFilter] = useState(
    getDefaultPostStatusFilterState,
  );

  const toggleStatus = useCallback((target: PostStatusFilterTarget) => {
    setStatusFilter((current) => togglePostStatusFilter(current, target));
  }, []);

  const filteredPosts = useMemo(
    () => filterPostsByStatus(posts, statusFilter),
    [posts, statusFilter],
  );

  return {
    filteredPosts,
    showAll: statusFilter.showAll,
    activeStatuses: statusFilter.statuses,
    toggleStatus,
    statusOptions,
  };
}
