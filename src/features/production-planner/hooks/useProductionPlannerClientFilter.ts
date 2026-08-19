import { useCallback } from "react";
import { useSearchParams } from "react-router";

import {
  PRODUCTION_PLANNER_ALL_CLIENTS,
  PRODUCTION_PLANNER_CLIENT_PARAM,
} from "@/features/production-planner/constants/routes";

export function useProductionPlannerClientFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClientId =
    searchParams.get(PRODUCTION_PLANNER_CLIENT_PARAM)?.trim() ||
    PRODUCTION_PLANNER_ALL_CLIENTS;

  const setSelectedClientId = useCallback(
    (clientId: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!clientId || clientId === PRODUCTION_PLANNER_ALL_CLIENTS) {
            next.delete(PRODUCTION_PLANNER_CLIENT_PARAM);
          } else {
            next.set(PRODUCTION_PLANNER_CLIENT_PARAM, clientId);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { selectedClientId, setSelectedClientId };
}
