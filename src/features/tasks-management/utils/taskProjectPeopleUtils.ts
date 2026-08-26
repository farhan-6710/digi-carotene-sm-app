import type { DevProjectListItem } from "@/features/development-projects/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";

export type TaskProjectPeopleSource = {
  manager_id: string;
  client_id: string;
  clients?: { id: string } | null;
  team_member_ids: string[];
};

/** Manager + active project team rows (deduped). */
export function getProjectAssociatedMemberIds(
  project: Pick<TaskProjectPeopleSource, "manager_id" | "team_member_ids">,
): string[] {
  const ids = new Set<string>([project.manager_id, ...project.team_member_ids]);
  return [...ids];
}

export function getProjectClientId(
  project: Pick<TaskProjectPeopleSource, "client_id" | "clients">,
): string | null {
  return project.client_id || project.clients?.id || null;
}

export function toTaskProjectPeopleSource(
  project: ProjectListItem | DevProjectListItem,
): TaskProjectPeopleSource {
  return {
    manager_id: project.manager_id,
    client_id: project.client_id,
    clients: project.clients,
    team_member_ids: project.team_member_ids ?? [],
  };
}
