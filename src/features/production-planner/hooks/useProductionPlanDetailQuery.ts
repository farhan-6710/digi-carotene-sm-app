import { useCallback } from "react";

import type {
  ProductionPlan,
  ProductionPlanItem,
} from "@/features/production-planner/types/types";
import { fetchProductionPlanItems } from "@/services/productionPlanItemsService";
import { fetchProductionPlanById } from "@/services/productionPlansService";
import { useFetch } from "@/shared/hooks/useFetch";

type ProductionPlanDetail = {
  plan: ProductionPlan | null;
  items: ProductionPlanItem[];
};

const EMPTY: ProductionPlanDetail = { plan: null, items: [] };

export function useProductionPlanDetailQuery(planId: string) {
  const load = useCallback(async (): Promise<ProductionPlanDetail> => {
    if (!planId) {
      return EMPTY;
    }

    const [plan, items] = await Promise.all([
      fetchProductionPlanById(planId),
      fetchProductionPlanItems(planId),
    ]);

    return { plan, items };
  }, [planId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    plan: data.plan,
    items: data.items,
    isLoading,
    error,
    setError,
    reload,
  };
}
