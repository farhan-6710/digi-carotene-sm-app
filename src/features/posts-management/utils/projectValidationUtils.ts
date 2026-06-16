import type { ProjectListItem } from "@/features/projects-management/types/types";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";

export function findRegisteredProject(
  projectId: string,
  projects: ProjectListItem[],
): ProjectListItem | undefined {
  return projects.find((project) => project.id === projectId);
}

export function getProjectLabel(project: ProjectListItem): string {
  return getProjectDisplayLabel(project);
}
