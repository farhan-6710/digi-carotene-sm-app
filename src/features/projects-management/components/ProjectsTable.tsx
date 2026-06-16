import { Loader2 } from "lucide-react";

import { ProjectsTableRow } from "@/features/projects-management/components/ProjectsTableRow";
import type { ProjectsTableProps } from "@/features/projects-management/types/components";

export function ProjectsTable({
  projects,
  isLoading,
  onEditProject,
}: ProjectsTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
        <div>
          <div className="text-sm font-semibold">Projects Directory</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Each project belongs to a client and has its own social accounts and team.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.5fr] gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden">
          <div>PROJECT</div>
          <div>CLIENT</div>
          <div>MANAGER</div>
          <div>SOCIALS</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center px-6 py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No projects found. Add a client first, then create your first project.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projects.map((project) => (
              <ProjectsTableRow
                key={project.id}
                project={project}
                onEditProject={onEditProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
