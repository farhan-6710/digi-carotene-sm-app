import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectDialog } from "@/features/projects-management/components/ProjectDialog";
import { ProjectsTable } from "@/features/projects-management/components/ProjectsTable";
import { useProjectDialog } from "@/features/projects-management/hooks/useProjectDialog";
import { useProjectsQuery } from "@/features/projects-management/hooks/useProjectsQuery";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";

export function ProjectsManagementPage() {
  const { can } = usePermissions();
  const { projects, isLoading, error, setError, reload } = useProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useProjectDialog({
    reload,
    setError,
  });
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");

  const filteredProjects = useMemo(
    () => filterByActiveStatus(projects, statusFilter),
    [projects, statusFilter],
  );

  return (
    <PageShell
      heading="Projects Management"
      description="Manage client projects, social profile URLs, and team assignments. Posts are scheduled per project."
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
          <ProjectDialog {...dialog} />
        ) : null
      }
    >
      <ProjectsTable
        projects={filteredProjects}
        isLoading={isLoading}
        canEdit={can("projects.update")}
        onEditProject={openEditDialog}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </PageShell>
  );
}
