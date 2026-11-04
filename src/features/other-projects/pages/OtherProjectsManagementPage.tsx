import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { OtherProjectDialog } from "@/features/other-projects/components/OtherProjectDialog";
import { OtherProjectsTable } from "@/features/other-projects/components/OtherProjectsTable";
import { useOtherProjectDialog } from "@/features/other-projects/hooks/useOtherProjectDialog";
import { useOtherProjectsQuery } from "@/features/other-projects/hooks/useOtherProjectsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { PageShell } from "@/shared/components/PageShell";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { deleteOtherProjectsByIds } from "@/services/otherProjectsService";

export function OtherProjectsManagementPage() {
  const { can } = usePermissions();
  const { projects, isLoading, error, setError, reload } =
    useOtherProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useOtherProjectDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] =
    useState<ActiveStatusFilterId>("active");
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
    (ids: string[]) => deleteOtherProjectsByIds(ids),
    [],
  );
  const { isDeleting, runBulkDelete } = useDirectoryBulkDelete({
    deleteByIds,
    reload,
    clearSelection: bulk.clear,
    successMessage: "Selected other projects deleted.",
  });

  return (
    <PageShell
      heading="Other Projects"
      description="Manage projects that are not social media or development work."
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
          <OtherProjectDialog {...dialog} />
        ) : null
      }
    >
      <OtherProjectsTable
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
