import { Pencil } from "lucide-react";

import { ProjectTableSocialIcons } from "@/features/projects-management/components/ProjectTableSocialIcons";
import type { ProjectListItem } from "@/features/projects-management/types/types";

type ProjectsTableRowProps = {
  project: ProjectListItem;
  onEditProject: (project: ProjectListItem) => void;
};

export function ProjectsTableRow({
  project,
  onEditProject,
}: ProjectsTableRowProps) {
  return (
    <div className="grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.5fr] sm:gap-4">
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT
        </span>
        {project.project_name}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          CLIENT
        </span>
        {project.clients?.client_name ?? "—"}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          MANAGER
        </span>
        {project.team_members?.member_name ?? "—"}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SOCIALS
        </span>
        <ProjectTableSocialIcons socials={project.socials} />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onEditProject(project)}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit project</span>
        </button>
      </div>
    </div>
  );
}
