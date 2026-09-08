import { useCallback } from "react";

import type { Client } from "@/features/clients-management/types/types";
import type { DevProjectListItem } from "@/features/development-projects/types/types";
import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchClientById } from "@/services/clientsService";
import { fetchDevProjectsByClientId } from "@/services/devProjectsService";
import { fetchOtherProjectsByClientId } from "@/services/otherProjectsService";
import { fetchProductionPlansByClientId } from "@/services/productionPlansService";
import { fetchProjectsByClientId } from "@/services/projectsService";
import { useFetch } from "@/shared/hooks/useFetch";

type ClientDetail = {
  client: Client | null;
  projects: ProjectListItem[];
  devProjects: DevProjectListItem[];
  otherProjects: OtherProjectListItem[];
  productionPlans: ProductionPlan[];
};

const EMPTY: ClientDetail = {
  client: null,
  projects: [],
  devProjects: [],
  otherProjects: [],
  productionPlans: [],
};

export function useClientDetailQuery(clientId: string) {
  const load = useCallback(async (): Promise<ClientDetail> => {
    if (!clientId) {
      return EMPTY;
    }

    const [client, projects, devProjects, otherProjects, productionPlans] =
      await Promise.all([
        fetchClientById(clientId),
        fetchProjectsByClientId(clientId),
        fetchDevProjectsByClientId(clientId),
        fetchOtherProjectsByClientId(clientId),
        fetchProductionPlansByClientId(clientId),
      ]);

    return { client, projects, devProjects, otherProjects, productionPlans };
  }, [clientId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    client: data.client,
    projects: data.projects,
    devProjects: data.devProjects,
    otherProjects: data.otherProjects,
    productionPlans: data.productionPlans,
    isLoading,
    error,
    setError,
    reload,
  };
}
