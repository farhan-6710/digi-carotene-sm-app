import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import {
  DEFAULT_TASK_TAB,
  TASK_ETA_PARAM,
  TASK_TAB_PARAM,
  TASK_TABS,
  type TaskTabId,
} from "@/features/tasks-management/constants/taskTabs";
import { readUrlDateString } from "@/shared/utils/urlDateParams";

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

/** ETA day filter from `?eta=yyyy-MM-dd` (empty = no filter). */
export function useTaskEtaFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const etaDate = useMemo(
    () => readUrlDateString(searchParams, TASK_ETA_PARAM) ?? "",
    [searchParams],
  );

  const setEtaDate = useCallback(
    (next: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!next) {
            params.delete(TASK_ETA_PARAM);
          } else {
            params.set(TASK_ETA_PARAM, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { etaDate, setEtaDate };
}

export function useTaskSearchQuery() {
  const [searchQuery, setSearchQuery] = useState("");
  return { searchQuery, setSearchQuery };
}
