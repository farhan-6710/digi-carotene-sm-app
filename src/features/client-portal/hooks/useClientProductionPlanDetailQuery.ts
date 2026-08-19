import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  ProductionPlan,
  ProductionPlanContent,
} from "@/features/production-planner/types/types";
import { fetchProductionPlanItems } from "@/services/productionPlanItemsService";
import { fetchProductionPlanById } from "@/services/productionPlansService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientPlanDetail = {
  plan: ProductionPlan | null;
  contents: ProductionPlanContent[];
};

const EMPTY: ClientPlanDetail = { plan: null, contents: [] };

export function useClientProductionPlanDetailQuery(planId: string) {
  const { clientId } = useAuth();

  const load = useCallback(async (): Promise<ClientPlanDetail> => {
    if (!planId || !clientId) return EMPTY;
    const plan = await fetchProductionPlanById(planId);
    if (!plan || plan.client_id !== clientId) return EMPTY;
    return {
      plan,
      contents: await fetchProductionPlanItems(planId),
    };
  }, [planId, clientId]);

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
