import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

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

export function useTaskSearchQuery() {
  const [searchQuery, setSearchQuery] = useState("");
  return { searchQuery, setSearchQuery };
}
