import { useCallback } from "react";

import type { Lead } from "@/features/crm/types/types";
import { fetchLeads } from "@/services/leadsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useLeadsQuery() {
  const load = useCallback(() => fetchLeads(), []);
  const {
    data: leads,
    isLoading,
    error,
    setError,
    reload,
  } = useFetch<Lead[]>(load, []);

  return { leads, isLoading, error, setError, reload };
}
