import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  ProjectListItem,
  ProjectSocials,
} from "@/features/projects-management/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { seesAllProjects } from "@/shared/utils/rbac";

export type CreateProjectInput = {
  projectName: string;
  clientId: string;
  managerId: string;
  socials?: ProjectSocials | null;
  teamMemberIds?: string[];
};

export type UpdateProjectInput = CreateProjectInput;

type ProjectRow = {
  id: string;
  project_name: string;
  client_id: string;
  socials: ProjectSocials | null;
  manager_id: string;
  created_at: string;
  updated_at: string;
  clients: ProjectListItem["clients"] | ProjectListItem["clients"][];
  team_members: ProjectListItem["team_members"] | ProjectListItem["team_members"][];
};

function normalizeProjectRow(
  row: ProjectRow,
  teamMemberIds: string[],
): ProjectListItem {
  const client = Array.isArray(row.clients) ? row.clients[0] ?? null : row.clients;
  const manager = Array.isArray(row.team_members)
    ? row.team_members[0] ?? null
    : row.team_members;

  return {
    id: row.id,
    project_name: row.project_name,
    client_id: row.client_id,
    socials: row.socials,
    manager_id: row.manager_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    clients: client,
    team_members: manager,
    team_member_ids: teamMemberIds,
  };
}

// Builds a map of project id -> active member ids for the given projects.
async function fetchActiveMemberIdsByProject(
  projectIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (projectIds.length === 0) {
    return map;
  }

  const { data, error } = await supabase
    .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
    .select("project_id, member_id")
    .in("project_id", projectIds)
    .is("ended_at", null);

  if (error) {
    throw error;
  }

  for (const row of data ?? []) {
    const current = map.get(row.project_id) ?? [];
    current.push(row.member_id);
    map.set(row.project_id, current);
  }

  return map;
}

export async function fetchProjects(): Promise<ProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as ProjectRow[];
  const teamMap = await fetchActiveMemberIdsByProject(rows.map((row) => row.id));

  return rows.map((row) => normalizeProjectRow(row, teamMap.get(row.id) ?? []));
}

/** Project ids where the member is manager or an active team assignee. */
export async function fetchAssignedProjectIds(
  teamMemberId: string,
): Promise<string[]> {
  const [managedResult, assignedResult] = await Promise.all([
    supabase
      .from(DB.PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
      .select("project_id")
      .eq("member_id", teamMemberId)
      .is("ended_at", null),
  ]);

  if (managedResult.error) {
    throw managedResult.error;
  }
  if (assignedResult.error) {
    throw assignedResult.error;
  }

  const ids = new Set<string>();
  for (const row of managedResult.data ?? []) {
    ids.add(row.id);
  }
  for (const row of assignedResult.data ?? []) {
    ids.add(row.project_id);
  }
  return [...ids];
}

async function fetchProjectsByIds(
  projectIds: string[],
): Promise<ProjectListItem[]> {
  if (projectIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .in("id", projectIds)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as ProjectRow[];
  const teamMap = await fetchActiveMemberIdsByProject(rows.map((row) => row.id));

  return rows.map((row) => normalizeProjectRow(row, teamMap.get(row.id) ?? []));
}

/**
 * Projects visible to the current team user.
 * Scope comes from `PROJECT_DATA_SCOPE_BY_ROLE` in rbac.ts (`all` | `assigned`).
 * Returns `null` project-id filter for "all"; empty list means no assignments.
 */
export async function resolveScopedProjectIds(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<string[] | null> {
  if (seesAllProjects(teamRole)) {
    return null;
  }
  if (!teamMemberId) {
    return [];
  }
  return fetchAssignedProjectIds(teamMemberId);
}

export async function fetchProjectsScoped(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<ProjectListItem[]> {
  const scopedIds = await resolveScopedProjectIds(teamRole, teamMemberId);
  if (scopedIds === null) {
    return fetchProjects();
  }
  return fetchProjectsByIds(scopedIds);
}

export async function fetchProjectsByClientId(
  clientId: string,
): Promise<ProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("client_id", clientId)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as ProjectRow[];
  const teamMap = await fetchActiveMemberIdsByProject(rows.map((row) => row.id));

  return rows.map((row) => normalizeProjectRow(row, teamMap.get(row.id) ?? []));
}

export async function fetchProjectById(
  projectId: string,
): Promise<ProjectListItem | null> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const teamMap = await fetchActiveMemberIdsByProject([projectId]);
  return normalizeProjectRow(data as unknown as ProjectRow, teamMap.get(projectId) ?? []);
}

// Adds, removes, or reactivates project_team_members rows to match the desired list.
async function syncProjectTeamMembers(
  projectId: string,
  managerId: string,
  teamMemberIds: string[],
): Promise<void> {
  const desiredIds = [...new Set(teamMemberIds)].filter(
    (memberId) => memberId && memberId !== managerId,
  );

  const { data: existingRows, error } = await supabase
    .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
    .select("id, member_id, ended_at")
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  const rows = existingRows ?? [];
  const activeRows = rows.filter((row) => row.ended_at === null);
  const activeIds = new Set(activeRows.map((row) => row.member_id));
  const desiredSet = new Set(desiredIds);

  // End assignments that are no longer wanted.
  for (const row of activeRows) {
    if (!desiredSet.has(row.member_id)) {
      await supabase
        .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
        .update({ ended_at: new Date().toISOString() })
        .eq("id", row.id);
    }
  }

  // Add or reactivate the wanted members.
  for (const memberId of desiredIds) {
    if (activeIds.has(memberId)) {
      continue;
    }

    const endedRow = rows.find(
      (row) => row.member_id === memberId && row.ended_at !== null,
    );

    if (endedRow) {
      await supabase
        .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
        .update({ ended_at: null, started_at: new Date().toISOString() })
        .eq("id", endedRow.id);
    } else {
      await supabase
        .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
        .insert({ project_id: projectId, member_id: memberId });
    }
  }
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectListItem> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .insert({
      project_name: input.projectName,
      client_id: input.clientId,
      manager_id: input.managerId,
      socials: input.socials || {},
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await syncProjectTeamMembers(data.id, input.managerId, input.teamMemberIds ?? []);

  return (await fetchProjectById(data.id))!;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<ProjectListItem> {
  const { error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .update({
      project_name: input.projectName,
      client_id: input.clientId,
      manager_id: input.managerId,
      socials: input.socials || {},
    })
    .eq("id", projectId);

  if (error) {
    throw error;
  }

  await syncProjectTeamMembers(projectId, input.managerId, input.teamMemberIds ?? []);

  return (await fetchProjectById(projectId))!;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .delete()
    .eq("id", projectId);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This project has scheduled posts. Remove or reassign those posts first.",
      );
    }
    throw new Error(error.message ?? "Failed to delete project.");
  }
}
