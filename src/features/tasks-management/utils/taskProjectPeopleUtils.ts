import type { ProjectListItem } from "@/features/projects-management/types/types";

/** Manager + active project team rows (deduped). */
export function getProjectAssociatedMemberIds(
  project: Pick<ProjectListItem, "manager_id" | "team_member_ids">,
): string[] {
  const ids = new Set<string>([project.manager_id, ...project.team_member_ids]);
  return [...ids];
}

export function getProjectClientId(
  project: Pick<ProjectListItem, "client_id" | "clients">,
): string | null {
  return project.client_id || project.clients?.id || null;
}
