import { useCallback } from "react";

import type { SharedPlanView } from "@/features/share/types/types";
import { fetchSharedProductionPlan } from "@/services/shareService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useSharedPlanQuery(token: string) {
  const load = useCallback(async (): Promise<SharedPlanView | null> => {
    if (!token) return null;
    return fetchSharedProductionPlan(token);
  }, [token]);

  const { data, isLoading, error, setError, reload } = useFetch(load, null);

  return { view: data, isLoading, error, setError, reload };
}
