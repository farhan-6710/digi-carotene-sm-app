import { Plus } from "lucide-react";

import { ProjectDialog } from "@/features/projects-management/components/ProjectDialog";
import { ProjectsTable } from "@/features/projects-management/components/ProjectsTable";
import { useProjectsManagement } from "@/features/projects-management/hooks/useProjectsManagement";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function ProjectsManagementPage() {
  const { projects, isLoading, error, openAddDialog, openEditDialog, dialog } =
    useProjectsManagement();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Projects Management"
        description="Manage client projects, social profile URLs, and team assignments. Posts are scheduled per project."
        actions={
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Project
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        onEditProject={openEditDialog}
      />

      <ProjectDialog {...dialog} />
    </section>
  );
}
