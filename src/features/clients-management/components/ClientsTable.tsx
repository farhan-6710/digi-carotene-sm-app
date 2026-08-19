import { ClientsTableRow } from "@/features/clients-management/components/ClientsTableRow";
import { clientsDirectoryConfig } from "@/features/clients-management/constants/clientsDirectory";
import type { ClientsTableProps } from "@/features/clients-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { ACTIVE_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ClientsTable({
  clients,
  isLoading,
  canEdit,
  onEditClient,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: ClientsTableProps) {
  return (
    <DirectoryTable
      title={clientsDirectoryConfig.title}
      description={clientsDirectoryConfig.description}
      gridClass={clientsDirectoryConfig.gridClass}
      columns={clientsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No clients match that search."
          : clientsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={clients.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search clients"
            disabled={isLoading}
          />
          <ActiveStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            labels={ACTIVE_STATUS_FILTER_LABELS}
            disabled={isLoading}
            placeholder="Filter clients"
          />
        </div>
      }
    >
      {clients.map((client) => (
        <ClientsTableRow
          key={client.id}
          client={client}
          canEdit={canEdit}
          onEditClient={onEditClient}
        />
      ))}
    </DirectoryTable>
  );
}
