import { Plus } from "lucide-react";

import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/clients-management/components/ClientsTable";
import { useClientDialog } from "@/features/clients-management/hooks/useClientDialog";
import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";

export function ClientsManagementPage() {
  const { can } = usePermissions();
  const { clients, isLoading, error, setError, reload } = useClientsQuery();
  const { openAddDialog, openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
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
        clients={clients}
        isLoading={isLoading}
        canEdit={can("clients.update")}
        onEditClient={openEditDialog}
      />
    </PageShell>
  );
}
