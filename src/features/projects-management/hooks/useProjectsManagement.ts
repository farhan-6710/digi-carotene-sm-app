import { useProjectDialog } from "@/features/projects-management/hooks/useProjectDialog";
import { useProjectsQuery } from "@/features/projects-management/hooks/useProjectsQuery";

export function useProjectsManagement() {
  const { projects, isLoading, error, setError, reload } = useProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useProjectDialog({
    reload,
    setError,
  });

  return {
    projects,
    isLoading,
    error,
    openAddDialog,
    openEditDialog,
    dialog,
  };
}
