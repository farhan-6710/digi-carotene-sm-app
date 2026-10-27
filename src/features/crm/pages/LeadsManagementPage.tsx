import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { LeadDialog } from "@/features/crm/components/LeadDialog";
import { LeadsTable } from "@/features/crm/components/LeadsTable";
import {
  DEFAULT_LEAD_FOLLOW_UP_FILTER,
  type LeadFollowUpFilterId,
} from "@/features/crm/constants/leadFollowUpFilters";
import {
  DEFAULT_LEAD_SORT,
  LEAD_MONTH_FILTER_ALL,
  type LeadSortId,
} from "@/features/crm/constants/leadSort";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { LEAD_STATUS_LABELS } from "@/features/crm/constants/leadStatuses";
import { useLeadDialog } from "@/features/crm/hooks/useLeadDialog";
import { useLeadFollowUpActions } from "@/features/crm/hooks/useLeadFollowUpActions";
import { useLeadFollowUpsQuery } from "@/features/crm/hooks/useLeadFollowUpsQuery";
import { useLeadsQuery } from "@/features/crm/hooks/useLeadsQuery";
import {
  filterLeadsByFollowUp,
  groupFollowUpsByLeadId,
} from "@/features/crm/utils/leadFollowUpFilterUtils";
import { filterLeadsByCreatedMonth } from "@/features/crm/utils/leadMonthFilterUtils";
import { sortLeads } from "@/features/crm/utils/leadSortUtils";
import { formatLeadTags } from "@/features/crm/utils/leadTagUtils";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function LeadsManagementPage() {
  const { can } = usePermissions();
  const { leads, isLoading, error, setError, reload } = useLeadsQuery();
  const {
    followUps,
    isLoading: followUpsLoading,
    error: followUpsError,
    setError: setFollowUpsError,
    reload: reloadFollowUps,
  } = useLeadFollowUpsQuery();
  const { openAddDialog, openEditDialog, dialog } = useLeadDialog({
    reload,
    setError,
  });
  const followUpActions = useLeadFollowUpActions({
    reload: async () => {
      await reloadFollowUps();
    },
    setError: setFollowUpsError,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<LeadSortId>(DEFAULT_LEAD_SORT);
  const [monthFilter, setMonthFilter] = useState(LEAD_MONTH_FILTER_ALL);
  const [followUpFilter, setFollowUpFilter] = useState<LeadFollowUpFilterId>(
    DEFAULT_LEAD_FOLLOW_UP_FILTER,
  );

  const followUpsByLeadId = useMemo(
    () => groupFollowUpsByLeadId(followUps),
    [followUps],
  );

  const filteredLeads = useMemo(() => {
    const searched = leads.filter((lead) =>
      matchesListingSearch(searchQuery, [
        lead.name,
        lead.company,
        lead.email,
        lead.phone,
        lead.industry,
        String(lead.lead_score),
        LEAD_STATUS_LABELS[lead.status],
        LEAD_SOURCE_LABELS[lead.lead_source],
        formatLeadTags(lead.tags ?? []),
      ]),
    );
    const byMonth = filterLeadsByCreatedMonth(searched, monthFilter);
    const byFollowUp = filterLeadsByFollowUp(
      byMonth,
      followUps,
      followUpFilter,
    );
    // Overdue / upcoming already sorted by due date — keep that order.
    if (followUpFilter === "overdue" || followUpFilter === "upcoming") {
      return byFollowUp;
    }
    return sortLeads(byFollowUp, sort);
  }, [leads, searchQuery, monthFilter, followUps, followUpFilter, sort]);

  return (
    <PageShell
      heading="Leads Management"
      description="Track and follow up on inbound leads. Create, update, and remove leads as your pipeline moves."
      error={error ?? followUpsError}
      actions={
        can("leads.create") ? (
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Create Lead
          </Button>
        ) : null
      }
      dialog={
        can("leads.create") || can("leads.update") ? (
          <LeadDialog {...dialog} />
        ) : null
      }
    >
      <LeadsTable
        leads={filteredLeads}
        followUpsByLeadId={followUpsByLeadId}
        isLoading={isLoading || followUpsLoading}
        canEdit={can("leads.update")}
        isSavingFollowUp={followUpActions.isSaving}
        onEditLead={openEditDialog}
        onUpdateFollowUpStatus={followUpActions.updateStatus}
        onRescheduleFollowUp={followUpActions.reschedule}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sort={sort}
        onSortChange={setSort}
        monthFilter={monthFilter}
        onMonthFilterChange={setMonthFilter}
        followUpFilter={followUpFilter}
        onFollowUpFilterChange={setFollowUpFilter}
      />
    </PageShell>
  );
}
