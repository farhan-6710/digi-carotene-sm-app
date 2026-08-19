import { useCallback } from "react";

import type { SharedProjectView } from "@/features/share/types/types";
import { fetchSharedProject } from "@/services/shareService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useSharedProjectQuery(token: string) {
  const load = useCallback(async (): Promise<SharedProjectView | null> => {
    if (!token) return null;
    return fetchSharedProject(token);
  }, [token]);

  const { data, isLoading, error, reload } = useFetch(load, null);

  return { view: data, isLoading, error, reload };
}
