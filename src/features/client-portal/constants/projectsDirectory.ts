import type { ClientPortalProjectRow } from "@/features/client-portal/types/types";
import type { ProjectKind } from "@/features/projects-management/utils/projectKindUtils";
import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENT_PROJECTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.5fr)]";
export const CLIENT_PROJECTS_ROW_GRID_CLASS =
  "sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,0.6fr)_minmax(0,0.8fr)_minmax(0,0.5fr)]";

export const clientProjectsColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "TYPE" },
  { label: "MANAGER" },
  { label: "SOCIALS" },
  { label: "STATUS" },
];

export const clientProjectsDirectoryConfig = {
  title: "Projects",
  description: "Social media and development projects for your brand.",
  gridClass: CLIENT_PROJECTS_GRID_CLASS,
  columns: clientProjectsColumns,
  emptyMessage: "No projects for your brand yet.",
} as const;

export function buildClientPortalProjectRows(
  smProjects: Array<{
    id: string;
    project_name: string;
    is_active: boolean;
    socials: ClientPortalProjectRow["socials"];
    team_members: { member_name: string } | null;
  }>,
  smDetailPath: (id: string) => string,
  devProjects: Array<{
    id: string;
    project_name: string;
    is_active: boolean;
    team_members: { member_name: string } | null;
  }>,
  devDetailPath: (id: string) => string,
): ClientPortalProjectRow[] {
  const toRow = (
    project: {
      id: string;
      project_name: string;
      is_active: boolean;
      team_members: { member_name: string } | null;
    },
    kind: ProjectKind,
    detailPath: string,
    socials: ClientPortalProjectRow["socials"],
  ): ClientPortalProjectRow => ({
    id: project.id,
    project_name: project.project_name,
    project_kind: kind,
    manager_name: project.team_members?.member_name ?? null,
    is_active: project.is_active,
    socials,
    detailPath,
  });

  return [
    ...smProjects.map((project) =>
      toRow(project, "sm", smDetailPath(project.id), project.socials),
    ),
    ...devProjects.map((project) =>
      toRow(project, "dev", devDetailPath(project.id), null),
    ),
  ];
}
