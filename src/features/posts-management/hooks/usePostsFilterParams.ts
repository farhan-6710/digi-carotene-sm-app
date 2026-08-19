import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  POSTS_CLIENTS_PARAM,
  POSTS_PROJECTS_PARAM,
  parseFilterIdsParam,
  setFilterIdsParam,
} from "@/features/posts-management/utils/postsManagementUrlParams";

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

  const setSelectedClientIds = useCallback(
    (ids: string[]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        setFilterIdsParam(next, POSTS_CLIENTS_PARAM, ids);
        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const setSelectedProjectIds = useCallback(
    (ids: string[]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        setFilterIdsParam(next, POSTS_PROJECTS_PARAM, ids);
        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  return {
    selectedClientIds,
    selectedProjectIds,
    setSelectedClientIds,
    setSelectedProjectIds,
  };
}
