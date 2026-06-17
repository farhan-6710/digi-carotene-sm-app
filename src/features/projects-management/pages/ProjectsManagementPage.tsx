import { Plus } from "lucide-react";

import { ProjectDialog } from "@/features/projects-management/components/ProjectDialog";
import { ProjectsTable } from "@/features/projects-management/components/ProjectsTable";
import { useProjectDialog } from "@/features/projects-management/hooks/useProjectDialog";
import { useProjectsQuery } from "@/features/projects-management/hooks/useProjectsQuery";
import { ManagementPageShell } from "@/shared/components/ManagementPageShell";
import { Button } from "@/shared/ui/button";

export function ProjectsManagementPage() {
  const { projects, isLoading, error, setError, reload } = useProjectsQuery();
  const { openAddDialog, openEditDialog, dialog } = useProjectDialog({
    reload,
    setError,
  });

  return (
    <ManagementPageShell
      heading="Projects Management"
      description="Manage client projects, social profile URLs, and team assignments. Posts are scheduled per project."
      error={error}
      actions={
        <Button onClick={openAddDialog} className="rounded-full shadow-sm">
          <Plus className="mr-2 size-4" />
          Add Project
        </Button>
      }
      dialog={<ProjectDialog {...dialog} />}
    >
      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        onEditProject={openEditDialog}
      />
    </ManagementPageShell>
  );
}
