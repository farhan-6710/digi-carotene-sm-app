import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { DevProjectDialog } from "@/features/development-projects/components/DevProjectDialog";
import { DevProjectsTable } from "@/features/development-projects/components/DevProjectsTable";
import { useDevProjectDialog } from "@/features/development-projects/hooks/useDevProjectDialog";
import { useDevProjectsQuery } from "@/features/development-projects/hooks/useDevProjectsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { PageShell } from "@/shared/components/PageShell";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { deleteDevProjectsByIds } from "@/services/devProjectsService";

export function DevProjectsManagementPage() {
  const { can } = usePermissions();
  const { projects, isLoading, error, setError, reload } = useDevProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useDevProjectDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const canDelete = can("projects.delete");

  const filteredProjects = useMemo(() => {
    return filterByActiveStatus(projects, statusFilter).filter((project) =>
      matchesListingSearch(searchQuery, [
        project.project_name,
        project.clients?.client_name,
        project.team_members?.member_name,
        project.description,
      ]),
    );
  }, [projects, searchQuery, statusFilter]);

  const filteredIds = useMemo(
    () => filteredProjects.map((project) => project.id),
    [filteredProjects],
  );
  const bulk = useDirectoryBulkSelection(filteredIds);
  const deleteByIds = useCallback(
    (ids: string[]) => deleteDevProjectsByIds(ids),
    [],
  );
  const { isDeleting, runBulkDelete } = useDirectoryBulkDelete({
    deleteByIds,
    reload,
    clearSelection: bulk.clear,
    successMessage: "Selected development projects deleted.",
  });

  return (
    <PageShell
      heading="Development Projects"
      description="Manage client development projects and environment links."
      error={error}
      actions={
        can("projects.create") ? (
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Project
          </Button>
        ) : null
      }
      dialog={
        can("projects.create") || can("projects.update") ? (
          <DevProjectDialog {...dialog} />
        ) : null
      }
    >
      <DevProjectsTable
        projects={filteredProjects}
        isLoading={isLoading}
        canEdit={can("projects.update")}
        canDelete={canDelete}
        selectedIds={bulk.selectedIds}
        allVisibleSelected={bulk.allVisibleSelected}
        isDeleting={isDeleting}
        onToggleSelect={bulk.toggle}
        onToggleAllVisible={bulk.toggleAllVisible}
        onClearSelection={bulk.clear}
        onBulkDelete={() => runBulkDelete(bulk.selectedIds)}
        onEditProject={openEditDialog}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
