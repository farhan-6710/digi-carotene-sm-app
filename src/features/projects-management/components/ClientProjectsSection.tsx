import { Link } from "react-router";

import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";
import type { ClientProjectsSectionProps } from "@/features/projects-management/types/components";

export function ClientProjectsSection({
  projects,
  isLoading,
}: ClientProjectsSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">Projects</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Social accounts and posts are managed per project.
        </p>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          No projects yet.{" "}
          <Link to={PROJECTS_MANAGEMENT_PATH} className="text-primary hover:underline">
            Create a project
          </Link>{" "}
          for this client.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
            >
              <div>
                <div className="text-sm font-medium text-foreground">
                  {project.project_name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Manager: {project.team_members?.member_name ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
