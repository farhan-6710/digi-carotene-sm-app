import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { LeadDialog } from "@/features/crm/components/LeadDialog";
import { LeadsTable } from "@/features/crm/components/LeadsTable";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { LEAD_STATUS_LABELS } from "@/features/crm/constants/leadStatuses";
import { formatLeadTags } from "@/features/crm/utils/leadTagUtils";
import { useLeadDialog } from "@/features/crm/hooks/useLeadDialog";
import { useLeadsQuery } from "@/features/crm/hooks/useLeadsQuery";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function LeadsManagementPage() {
  const { can } = usePermissions();
  const { leads, isLoading, error, setError, reload } = useLeadsQuery();
  const { openAddDialog, openEditDialog, dialog } = useLeadDialog({
    reload,
    setError,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) =>
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
  }, [leads, searchQuery]);

  return (
    <PageShell
      heading="Leads Management"
      description="Track and follow up on inbound leads. Create, update, and remove leads as your pipeline moves."
      error={error}
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
        isLoading={isLoading}
        canEdit={can("leads.update")}
        onEditLead={openEditDialog}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
