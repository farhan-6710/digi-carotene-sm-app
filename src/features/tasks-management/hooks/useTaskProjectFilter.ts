import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  TASK_PROJECT_FILTER_PARAM,
  TASKS_ALL_PROJECTS,
} from "@/features/tasks-management/constants/taskProjectFilter";

export function useTaskProjectFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectFilter = useMemo(
    () =>
      searchParams.get(TASK_PROJECT_FILTER_PARAM)?.trim() || TASKS_ALL_PROJECTS,
    [searchParams],
  );

  const setProjectFilter = useCallback(
    (projectKey: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!projectKey || projectKey === TASKS_ALL_PROJECTS) {
            params.delete(TASK_PROJECT_FILTER_PARAM);
          } else {
            params.set(TASK_PROJECT_FILTER_PARAM, projectKey);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { projectFilter, setProjectFilter };
}
