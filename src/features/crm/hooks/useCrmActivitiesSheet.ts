import { useCallback, useMemo, useState } from "react";

import type { CrmSheetActivity } from "@/features/crm/types/types";
import {
  buildCrmSheetActivities,
  splitCrmSheetActivities,
} from "@/features/crm/utils/crmActivitySheetUtils";
import { fetchLeads } from "@/services/leadsService";
import {
  fetchAllLeadCalls,
  fetchAllLeadMeetings,
  fetchAllLeadTasks,
} from "@/services/leadActivitiesService";
import { useFetch } from "@/shared/hooks/useFetch";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function useCrmActivitiesSheet() {
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async (): Promise<CrmSheetActivity[]> => {
    const [tasks, meetings, calls, leads] = await Promise.all([
      fetchAllLeadTasks(),
      fetchAllLeadMeetings(),
      fetchAllLeadCalls(),
      fetchLeads(),
    ]);
    return buildCrmSheetActivities(tasks, meetings, calls, leads);
  }, []);

  const { data, isLoading, error } = useFetch(load, []);

  const filtered = useMemo(
    () =>
      data.filter((row) =>
        matchesListingSearch(searchQuery, [
          row.title,
          row.leadName,
          row.kind,
          row.meta,
        ]),
      ),
    [data, searchQuery],
  );

  const { open, closed } = useMemo(
    () => splitCrmSheetActivities(filtered),
    [filtered],
  );

  return {
    openActivities: open,
    closedActivities: closed,
    isEmpty: filtered.length === 0,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
  };
}
