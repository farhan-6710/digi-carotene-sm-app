import { useCallback } from "react";

import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import { fetchOtherProjectById } from "@/services/otherProjectsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useOtherProjectDetailQuery(projectId: string) {
  const load = useCallback(async (): Promise<OtherProjectListItem | null> => {
    if (!projectId) return null;
    return fetchOtherProjectById(projectId);
  }, [projectId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, null);

  return { project: data, isLoading, error, setError, reload };
}
