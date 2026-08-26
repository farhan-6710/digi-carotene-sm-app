import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { DevProjectDialog } from "@/features/development-projects/components/DevProjectDialog";
import { DevProjectsTable } from "@/features/development-projects/components/DevProjectsTable";
import { useDevProjectDialog } from "@/features/development-projects/hooks/useDevProjectDialog";
import { useDevProjectsQuery } from "@/features/development-projects/hooks/useDevProjectsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function DevProjectsManagementPage() {
  const { can } = usePermissions();
  const { projects, isLoading, error, setError, reload } = useDevProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useDevProjectDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return filterByActiveStatus(projects, statusFilter).filter((project) =>
      matchesListingSearch(searchQuery, [
        project.project_name,
        project.clients?.client_name,
        project.team_members?.member_name,
        project.tech_stack,
        project.description,
      ]),
    );
  }, [projects, searchQuery, statusFilter]);

  return (
    <PageShell
      heading="Development Projects"
      description="Manage client development projects, tech stack, and environment links."
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
        onEditProject={openEditDialog}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
