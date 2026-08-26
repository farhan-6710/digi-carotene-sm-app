import { useCallback } from "react";

import type { DevProjectListItem } from "@/features/development-projects/types/types";
import { fetchDevProjectById } from "@/services/devProjectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useDevProjectDetailQuery(projectId: string) {
  const load = useCallback(async (): Promise<DevProjectListItem | null> => {
    if (!projectId) return null;
    return fetchDevProjectById(projectId);
  }, [projectId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, null);

  return { project: data, isLoading, error, setError, reload };
}
