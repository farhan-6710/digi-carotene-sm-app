import { useCallback } from "react";

import type {
  Lead,
  LeadAttachment,
  LeadCall,
  LeadMeeting,
  LeadNote,
  LeadTask,
} from "@/features/crm/types/types";
import {
  fetchLeadAttachments,
  fetchLeadCalls,
  fetchLeadMeetings,
  fetchLeadTasks,
} from "@/services/leadActivitiesService";
import { fetchLeadById, fetchLeadNotes } from "@/services/leadsService";
import { useFetch } from "@/shared/hooks/useFetch";

type LeadDetail = {
  lead: Lead | null;
  notes: LeadNote[];
  attachments: LeadAttachment[];
  tasks: LeadTask[];
  meetings: LeadMeeting[];
  calls: LeadCall[];
};

const EMPTY: LeadDetail = {
  lead: null,
  notes: [],
  attachments: [],
  tasks: [],
  meetings: [],
  calls: [],
};

export function useLeadDetailQuery(leadId: string) {
  const load = useCallback(async (): Promise<LeadDetail> => {
    if (!leadId) return EMPTY;
    const lead = await fetchLeadById(leadId);
    if (!lead) return EMPTY;

    const [notes, attachments, tasks, meetings, calls] = await Promise.all([
      fetchLeadNotes(leadId),
      fetchLeadAttachments(leadId),
      fetchLeadTasks(leadId),
      fetchLeadMeetings(leadId),
      fetchLeadCalls(leadId),
    ]);

    return { lead, notes, attachments, tasks, meetings, calls };
  }, [leadId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    lead: data.lead,
    notes: data.notes,
    attachments: data.attachments,
    tasks: data.tasks,
    meetings: data.meetings,
    calls: data.calls,
    isLoading,
    error,
    setError,
    reload,
  };
}
