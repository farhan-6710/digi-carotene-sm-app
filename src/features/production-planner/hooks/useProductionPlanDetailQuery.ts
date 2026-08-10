import { useCallback } from "react";

import type {
  ProductionPlan,
  ProductionPlanContent,
} from "@/features/production-planner/types/types";
import { fetchProductionPlanItems } from "@/services/productionPlanItemsService";
import { fetchProductionPlanById } from "@/services/productionPlansService";
import { useFetch } from "@/shared/hooks/useFetch";

type ProductionPlanDetail = {
  plan: ProductionPlan | null;
  contents: ProductionPlanContent[];
};

const EMPTY: ProductionPlanDetail = { plan: null, contents: [] };

export function useProductionPlanDetailQuery(planId: string) {
  const load = useCallback(async (): Promise<ProductionPlanDetail> => {
    if (!planId) {
      return EMPTY;
    }

    const [plan, contents] = await Promise.all([
      fetchProductionPlanById(planId),
      fetchProductionPlanItems(planId),
    ]);

    return { plan, contents };
  }, [planId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    plan: data.plan,
    contents: data.contents,
    isLoading,
    error,
    setError,
    reload,
  };
}
