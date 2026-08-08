import { useCallback } from "react";

import { fetchProductionPlans } from "@/services/productionPlansService";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import { useFetch } from "@/shared/hooks/useFetch";

export function useProductionPlansQuery() {
  const load = useCallback(() => fetchProductionPlans(), []);
  const {
    data: plans,
    isLoading,
    error,
    setError,
    reload,
    setData,
  } = useFetch<ProductionPlan[]>(load, []);

  return { plans, isLoading, error, setError, reload, setData };
}
