import { useClientDialog } from "@/features/clients-management/hooks/useClientDialog";
import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";

export function useClientsManagement() {
  const { clients, isLoading, error, setError, reload } = useClientsQuery();
  const { openAddDialog, openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });

  return {
    clients,
    isLoading,
    error,
    openAddDialog,
    openEditDialog,
    dialog,
  };
}
