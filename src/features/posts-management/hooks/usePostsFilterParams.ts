import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  POSTS_CLIENTS_PARAM,
  POSTS_PROJECTS_PARAM,
  parseFilterIdsParam,
  parsePostsStatusParam,
  setFilterIdsParam,
  setPostsStatusParam,
} from "@/features/posts-management/utils/postsManagementUrlParams";
import type { PostStatusSelectId } from "@/features/posts-management/constants/postStatusSelect";

export function usePostsFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedClientIds = useMemo(
    () => parseFilterIdsParam(searchParams, POSTS_CLIENTS_PARAM),
    [searchParams],
  );

  const selectedProjectIds = useMemo(
    () => parseFilterIdsParam(searchParams, POSTS_PROJECTS_PARAM),
    [searchParams],
  );

  const statusFilter = useMemo(
    () => parsePostsStatusParam(searchParams),
    [searchParams],
  );

  const setSelectedClientIds = useCallback(
    (ids: string[]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setFilterIdsParam(next, POSTS_CLIENTS_PARAM, ids);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSelectedProjectIds = useCallback(
    (ids: string[]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setFilterIdsParam(next, POSTS_PROJECTS_PARAM, ids);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setStatusFilter = useCallback(
    (status: PostStatusSelectId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          setPostsStatusParam(next, status);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    selectedClientIds,
    selectedProjectIds,
    statusFilter,
    setSelectedClientIds,
    setSelectedProjectIds,
    setStatusFilter,
  };
}
