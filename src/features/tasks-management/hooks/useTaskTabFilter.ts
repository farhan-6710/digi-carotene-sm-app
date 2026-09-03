import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import {
  DEFAULT_TASK_SORT,
  TASK_SORT_PARAM,
  TASK_SORTS,
  type TaskSortId,
} from "@/features/tasks-management/constants/taskSort";
import {
  DEFAULT_TASK_STATUS_FILTER,
  TASK_STATUS_FILTER_PARAM,
  TASK_STATUS_FILTERS,
  type TaskStatusFilterId,
} from "@/features/tasks-management/constants/taskStatusFilter";
import {
  DEFAULT_TASK_TAB,
  TASK_TAB_PARAM,
  TASK_TABS,
  type TaskTabId,
} from "@/features/tasks-management/constants/taskTabs";

function parseTaskTab(value: string | null): TaskTabId {
  if (value && (TASK_TABS as readonly string[]).includes(value)) {
    return value as TaskTabId;
  }
  return DEFAULT_TASK_TAB;
}

function parseTaskSort(value: string | null): TaskSortId {
  if (value && (TASK_SORTS as readonly string[]).includes(value)) {
    return value as TaskSortId;
  }
  return DEFAULT_TASK_SORT;
}

function parseTaskStatusFilter(value: string | null): TaskStatusFilterId {
  if (value && (TASK_STATUS_FILTERS as readonly string[]).includes(value)) {
    return value as TaskStatusFilterId;
  }
  return DEFAULT_TASK_STATUS_FILTER;
}

export function useTaskTabFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = useMemo(
    () => parseTaskTab(searchParams.get(TASK_TAB_PARAM)),
    [searchParams],
  );

  const setTab = useCallback(
    (next: TaskTabId) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === DEFAULT_TASK_TAB) {
            params.delete(TASK_TAB_PARAM);
          } else {
            params.set(TASK_TAB_PARAM, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { tab, setTab };
}

/** Task list sort from `?sort=` (default ETA ascending). */
export function useTaskSort() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = useMemo(
    () => parseTaskSort(searchParams.get(TASK_SORT_PARAM)),
    [searchParams],
  );

  const setSort = useCallback(
    (next: TaskSortId) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === DEFAULT_TASK_SORT) {
            params.delete(TASK_SORT_PARAM);
          } else {
            params.set(TASK_SORT_PARAM, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { sort, setSort };
}

/** Status scope from `?status=` (default open — hides completed). */
export function useTaskStatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = useMemo(
    () => parseTaskStatusFilter(searchParams.get(TASK_STATUS_FILTER_PARAM)),
    [searchParams],
  );

  const setStatusFilter = useCallback(
    (next: TaskStatusFilterId) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === DEFAULT_TASK_STATUS_FILTER) {
            params.delete(TASK_STATUS_FILTER_PARAM);
          } else {
            params.set(TASK_STATUS_FILTER_PARAM, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { statusFilter, setStatusFilter };
}

export function useTaskSearchQuery() {
  const [searchQuery, setSearchQuery] = useState("");
  return { searchQuery, setSearchQuery };
}
