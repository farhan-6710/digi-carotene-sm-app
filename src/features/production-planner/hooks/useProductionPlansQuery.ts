import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Client } from "@/features/clients-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import { fetchClients } from "@/services/clientsService";
import { fetchProductionPlansScoped } from "@/services/productionPlansService";
import { useFetch } from "@/shared/hooks/useFetch";

type ProductionPlansBundle = {
  plans: ProductionPlan[];
  clients: Client[];
};

const EMPTY: ProductionPlansBundle = { plans: [], clients: [] };

export function useProductionPlansQuery() {
  const { teamRole, teamMemberId } = useAuth();

  const load = useCallback(async (): Promise<ProductionPlansBundle> => {
    const [plans, clients] = await Promise.all([
      fetchProductionPlansScoped(teamRole, teamMemberId),
      fetchClients(),
    ]);
    return { plans, clients };
  }, [teamRole, teamMemberId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    plans: data.plans,
    clients: data.clients,
    isLoading,
    error,
    setError,
    reload,
  };
}
