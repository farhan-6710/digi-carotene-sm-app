import { useCallback } from "react";

import type { Lead, LeadNote } from "@/features/crm/types/types";
import { fetchLeadById, fetchLeadNotes } from "@/services/leadsService";
import { useFetch } from "@/shared/hooks/useFetch";

type LeadDetail = {
  lead: Lead | null;
  notes: LeadNote[];
};

const EMPTY: LeadDetail = { lead: null, notes: [] };

export function useLeadDetailQuery(leadId: string) {
  const load = useCallback(async (): Promise<LeadDetail> => {
    if (!leadId) return EMPTY;
    const lead = await fetchLeadById(leadId);
    if (!lead) return EMPTY;
    const notes = await fetchLeadNotes(leadId);
    return { lead, notes };
  }, [leadId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    lead: data.lead,
    notes: data.notes,
    isLoading,
    error,
    setError,
    reload,
  };
}
