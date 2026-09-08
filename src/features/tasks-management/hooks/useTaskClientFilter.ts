import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  TASK_CLIENT_FILTER_PARAM,
  TASKS_ALL_CLIENTS,
} from "@/features/tasks-management/constants/taskClientFilter";

export function useTaskClientFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clientFilter = useMemo(
    () =>
      searchParams.get(TASK_CLIENT_FILTER_PARAM)?.trim() || TASKS_ALL_CLIENTS,
    [searchParams],
  );

  const setClientFilter = useCallback(
    (clientId: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!clientId || clientId === TASKS_ALL_CLIENTS) {
            params.delete(TASK_CLIENT_FILTER_PARAM);
          } else {
            params.set(TASK_CLIENT_FILTER_PARAM, clientId);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { clientFilter, setClientFilter };
}
