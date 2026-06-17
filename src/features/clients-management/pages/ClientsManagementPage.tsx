import { Plus } from "lucide-react";

import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/clients-management/components/ClientsTable";
import { useClientDialog } from "@/features/clients-management/hooks/useClientDialog";
import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";
import { ManagementPageShell } from "@/shared/components/ManagementPageShell";
import { Button } from "@/shared/ui/button";

export function ClientsManagementPage() {
  const { clients, isLoading, error, setError, reload } = useClientsQuery();
  const { openAddDialog, openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });

  return (
    <ManagementPageShell
      heading="Clients Management"
      description="Manage client companies and contact details. Create projects under each client for social accounts and posts."
      error={error}
      actions={
        <Button onClick={openAddDialog} className="rounded-full shadow-sm">
          <Plus className="mr-2 size-4" />
          Add Client
        </Button>
      }
      dialog={<ClientDialog {...dialog} />}
    >
      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        onEditClient={openEditDialog}
      />
    </ManagementPageShell>
  );
}
