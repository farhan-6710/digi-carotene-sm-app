import { Link } from "react-router";

import { buildDevProjectDetailPath, DEV_PROJECTS_MANAGEMENT_PATH } from "@/features/development-projects/constants/routes";
import {
  buildProjectDetailPath,
  PROJECTS_MANAGEMENT_PATH,
} from "@/features/projects-management/constants/routes";
import type { ClientProjectsSectionProps } from "@/features/projects-management/types/components";
import { projectKindLabel } from "@/features/projects-management/utils/projectKindUtils";

export function ClientProjectsSection({
  projects,
  devProjects,
  isLoading,
}: ClientProjectsSectionProps) {
  const hasAny = projects.length > 0 || devProjects.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">Projects</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Social media and development projects linked to this client.
        </p>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          Loading projects...
        </div>
      ) : !hasAny ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          No projects yet.{" "}
          <Link
            to={PROJECTS_MANAGEMENT_PATH}
            className="text-primary hover:underline"
          >
            Create a social media project
          </Link>{" "}
          or{" "}
          <Link
            to={DEV_PROJECTS_MANAGEMENT_PATH}
            className="text-primary hover:underline"
          >
            a development project
          </Link>
          .
        </div>
      ) : (
        <div className="divide-y divide-border">
          {projects.length > 0 ? (
            <>
              <div className="bg-muted/30 px-6 py-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Social media projects
              </div>
              {projects.map((project) => (
                <div
                  key={`sm-${project.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      <Link
                        to={buildProjectDetailPath(project.id)}
                        className="hover:text-primary hover:underline"
                      >
                        {project.project_name}
                      </Link>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {projectKindLabel("sm")} · Manager:{" "}
                      {project.team_members?.member_name ?? "—"}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}

          {devProjects.length > 0 ? (
            <>
              <div className="bg-muted/30 px-6 py-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Development projects
              </div>
              {devProjects.map((project) => (
                <div
                  key={`dev-${project.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      <Link
                        to={buildDevProjectDetailPath(project.id)}
                        className="hover:text-primary hover:underline"
                      >
                        {project.project_name}
                      </Link>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {projectKindLabel("dev")} · Manager:{" "}
                      {project.team_members?.member_name ?? "—"}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
