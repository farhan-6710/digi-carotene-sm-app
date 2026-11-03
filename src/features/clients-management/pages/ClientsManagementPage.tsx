import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/clients-management/components/ClientsTable";
import { useClientDialog } from "@/features/clients-management/hooks/useClientDialog";
import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { deleteClientsByIds } from "@/services/clientsService";

export function ClientsManagementPage() {
  const { can } = usePermissions();
  const { clients, isLoading, error, setError, reload } = useClientsQuery();
  const { openAddDialog, openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const canDelete = can("clients.delete");

  const filteredClients = useMemo(() => {
    return filterByActiveStatus(clients, statusFilter).filter((client) =>
      matchesListingSearch(searchQuery, [
        client.client_name,
        client.email,
        client.primary_contact_name,
        client.mobile_number,
        client.website_name,
      ]),
    );
  }, [clients, searchQuery, statusFilter]);

  const filteredIds = useMemo(
    () => filteredClients.map((client) => client.id),
    [filteredClients],
  );
  const bulk = useDirectoryBulkSelection(filteredIds);
  const deleteByIds = useCallback(
    (ids: string[]) => deleteClientsByIds(ids),
    [],
  );
  const { isDeleting, runBulkDelete } = useDirectoryBulkDelete({
    deleteByIds,
    reload,
    clearSelection: bulk.clear,
    successMessage: "Selected clients deleted.",
  });

  return (
    <PageShell
      heading="Clients Management"
      description="Manage client companies and contact details. Create projects under each client for social accounts and posts."
      error={error}
      actions={
        can("clients.create") ? (
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Client
          </Button>
        ) : null
      }
      dialog={
        can("clients.create") || can("clients.update") ? (
          <ClientDialog {...dialog} />
        ) : null
      }
    >
      <ClientsTable
        clients={filteredClients}
        isLoading={isLoading}
        canEdit={can("clients.update")}
        canDelete={canDelete}
        selectedIds={bulk.selectedIds}
        allVisibleSelected={bulk.allVisibleSelected}
        isDeleting={isDeleting}
        onToggleSelect={bulk.toggle}
        onToggleAllVisible={bulk.toggleAllVisible}
        onClearSelection={bulk.clear}
        onBulkDelete={() => runBulkDelete(bulk.selectedIds)}
        onEditClient={openEditDialog}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
