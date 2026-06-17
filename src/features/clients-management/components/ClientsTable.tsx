import { ClientsTableRow } from "@/features/clients-management/components/ClientsTableRow";
import { clientsDirectoryConfig } from "@/features/clients-management/constants/clientsDirectory";
import type { ClientsTableProps } from "@/features/clients-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ClientsTable({
  clients,
  isLoading,
  onEditClient,
}: ClientsTableProps) {
  return (
    <DirectoryTable
      title={clientsDirectoryConfig.title}
      description={clientsDirectoryConfig.description}
      gridClass={clientsDirectoryConfig.gridClass}
      columns={clientsDirectoryConfig.columns}
      emptyMessage={clientsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={clients.length === 0}
    >
      {clients.map((client) => (
        <ClientsTableRow
          key={client.id}
          client={client}
          onEditClient={onEditClient}
        />
      ))}
    </DirectoryTable>
  );
}
