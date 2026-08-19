import { useCallback } from "react";

import type { Client } from "@/features/clients-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchClientById } from "@/services/clientsService";
import { fetchProductionPlansByClientId } from "@/services/productionPlansService";
import { fetchProjectsByClientId } from "@/services/projectsService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientDetail = {
  client: Client | null;
  projects: ProjectListItem[];
  productionPlans: ProductionPlan[];
};

const EMPTY: ClientDetail = { client: null, projects: [], productionPlans: [] };

export function useClientDetailQuery(clientId: string) {
  const load = useCallback(async (): Promise<ClientDetail> => {
    if (!clientId) {
      return EMPTY;
    }

    const [client, projects, productionPlans] = await Promise.all([
      fetchClientById(clientId),
      fetchProjectsByClientId(clientId),
      fetchProductionPlansByClientId(clientId),
    ]);

    return { client, projects, productionPlans };
  }, [clientId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    client: data.client,
    projects: data.projects,
    productionPlans: data.productionPlans,
    isLoading,
    error,
    setError,
    reload,
  };
}
