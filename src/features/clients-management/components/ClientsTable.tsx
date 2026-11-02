import { useMemo } from "react";

import { ClientsTableRow } from "@/features/clients-management/components/ClientsTableRow";
import {
  CLIENTS_DIRECTORY_BULK_GRID_CLASS,
  clientsDirectoryColumns,
  clientsDirectoryConfig,
} from "@/features/clients-management/constants/clientsDirectory";
import type { ClientsTableProps } from "@/features/clients-management/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { ACTIVE_STATUS_FILTER_LABELS } from "@/shared/constants/activeStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function ClientsTable({
  clients,
  isLoading,
  canEdit,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  onEditClient,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: ClientsTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return clientsDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all clients"
            disabled={isLoading || clients.length === 0}
          />
        ),
      },
      ...clientsDirectoryColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    clients.length,
    isLoading,
    onToggleAllVisible,
  ]);

  return (
    <DirectoryTable
      title={clientsDirectoryConfig.title}
      description={clientsDirectoryConfig.description}
      gridClass={
        canDelete
          ? CLIENTS_DIRECTORY_BULK_GRID_CLASS
          : clientsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        searchQuery.trim()
          ? "No clients match that search."
          : clientsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={clients.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {canDelete && onClearSelection && onBulkDelete ? (
            <DirectoryBulkDeleteBar
              selectedCount={selectedIds.length}
              singularLabel="client"
              pluralLabel="clients"
              isDeleting={isDeleting}
              onClear={onClearSelection}
              onConfirmDelete={onBulkDelete}
            />
          ) : null}
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
          canDelete={canDelete}
          selected={selectedSet.has(client.id)}
          onToggleSelect={onToggleSelect}
          onEditClient={onEditClient}
        />
      ))}
    </DirectoryTable>
  );
}
