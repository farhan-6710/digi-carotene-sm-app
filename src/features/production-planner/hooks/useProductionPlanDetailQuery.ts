import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  ProductionPlan,
  ProductionPlanContent,
} from "@/features/production-planner/types/types";
import { fetchProductionPlanItems } from "@/services/productionPlanItemsService";
import {
  fetchAssignedProductionPlanIds,
  fetchProductionPlanById,
} from "@/services/productionPlansService";
import { useFetch } from "@/shared/hooks/useFetch";
import { can as canForRole } from "@/shared/utils/rbac";

type ProductionPlanDetail = {
  plan: ProductionPlan | null;
  contents: ProductionPlanContent[];
  canEditContent: boolean;
};

const EMPTY: ProductionPlanDetail = {
  plan: null,
  contents: [],
  canEditContent: false,
};

export function useProductionPlanDetailQuery(planId: string) {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<ProductionPlanDetail> => {
    if (!planId) {
      return EMPTY;
    }

    const plan = await fetchProductionPlanById(planId);
    if (!plan) {
      return EMPTY;
    }

    const canManagePlans = canForRole(teamRole, "productionPlans.update");
    const assignedIds = teamMemberId
      ? await fetchAssignedProductionPlanIds(teamMemberId)
      : [];
    const isAssigned = assignedIds.includes(plan.id);

    if (!canManagePlans && !isAssigned) {
      return EMPTY;
    }

    const contents = await fetchProductionPlanItems(planId);

    return {
      plan,
      contents,
      canEditContent: canManagePlans || isAssigned,
    };
  }, [planId, teamMemberId, teamRole]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    plan: data.plan,
    contents: data.contents,
    canEditContent: data.canEditContent,
    isLoading,
    error,
    setError,
    reload,
  };
}
