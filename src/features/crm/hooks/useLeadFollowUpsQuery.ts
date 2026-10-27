import { useCallback } from "react";

import type { LeadFollowUp } from "@/features/crm/types/types";
import { fetchAllLeadFollowUps } from "@/services/leadFollowUpsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function useLeadFollowUpsQuery() {
  const load = useCallback(() => fetchAllLeadFollowUps(), []);
  const {
    data: followUps,
    isLoading,
    error,
    setError,
    reload,
  } = useFetch<LeadFollowUp[]>(load, []);

  return { followUps, isLoading, error, setError, reload };
}
