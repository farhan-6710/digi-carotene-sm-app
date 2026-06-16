import { Plus } from "lucide-react";

import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { ClientsTable } from "@/features/clients-management/components/ClientsTable";
import { useClientsManagement } from "@/features/clients-management/hooks/useClientsManagement";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ClientsManagementPage() {
  const { clients, isLoading, error, openAddDialog, openEditDialog, dialog } =
    useClientsManagement();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Clients Management"
        description="Manage client companies and contact details. Create projects under each client for social accounts and posts."
        actions={
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Client
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        onEditClient={openEditDialog}
      />

      <ClientDialog {...dialog} />
    </section>
  );
}
