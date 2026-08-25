import { useCallback } from "react";

import { CONVERTED_LEAD_SCORE } from "@/features/crm/constants/leadScores";
import type { Lead } from "@/features/crm/types/types";
import { fetchConvertedLeads } from "@/services/leadsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useContactQuery() {
  const load = useCallback(
    () => fetchConvertedLeads(CONVERTED_LEAD_SCORE),
    [],
  );
  const {
    data: contacts,
    isLoading,
    error,
    setError,
    reload,
  } = useFetch<Lead[]>(load, []);

  return { contacts, isLoading, error, setError, reload };
}
