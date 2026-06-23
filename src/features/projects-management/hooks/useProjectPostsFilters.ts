import { useCallback, useMemo, useState } from "react";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import type { Post } from "@/features/posts-management/types/types";
import {
  filterPostsByMonth,
  filterPostsByStatus,
  getDefaultPostStatusFilterState,
  togglePostStatusFilter,
  type PostStatusFilterTarget,
} from "@/shared/utils/postStatusFilterUtils";

export function useProjectPostsFilters(posts: Post[]) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [statusFilter, setStatusFilter] = useState(getDefaultPostStatusFilterState);

  const selectMonth = useCallback((date: Date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }, []);

  const toggleStatus = useCallback((target: PostStatusFilterTarget) => {
    setStatusFilter((current) => togglePostStatusFilter(current, target));
  }, []);

  const filteredPosts = useMemo(() => {
    const byMonth = filterPostsByMonth(posts, year, month);
    return filterPostsByStatus(byMonth, statusFilter);
  }, [posts, year, month, statusFilter]);

  return {
    filteredPosts,
    year,
    month,
    selectMonth,
    showAll: statusFilter.showAll,
    activeStatuses: statusFilter.statuses,
    toggleStatus,
    statusOptions,
  };
}
