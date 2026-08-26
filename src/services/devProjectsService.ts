import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CreateDevProjectInput,
  DevProjectListItem,
  UpdateDevProjectInput,
} from "@/features/development-projects/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { seesAllProjects } from "@/shared/utils/rbac";

type DevProjectRow = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  description: string | null;
  tech_stack: string | null;
  repo_url: string | null;
  staging_url: string | null;
  production_url: string | null;
  start_date: string | null;
  target_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clients: DevProjectListItem["clients"] | DevProjectListItem["clients"][];
  team_members:
    | DevProjectListItem["team_members"]
    | DevProjectListItem["team_members"][];
};

function normalizeDevProjectRow(
  row: DevProjectRow,
  teamMemberIds: string[] = [],
): DevProjectListItem {
  const client = Array.isArray(row.clients)
    ? (row.clients[0] ?? null)
    : row.clients;
  const manager = Array.isArray(row.team_members)
    ? (row.team_members[0] ?? null)
    : row.team_members;

  return {
    id: row.id,
    project_name: row.project_name,
    client_id: row.client_id,
    manager_id: row.manager_id,
    description: row.description,
    tech_stack: row.tech_stack,
    repo_url: row.repo_url,
    staging_url: row.staging_url,
    production_url: row.production_url,
    start_date: row.start_date,
    target_date: row.target_date,
    is_active: row.is_active ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at,
    clients: client,
    team_members: manager,
    team_member_ids: teamMemberIds,
  };
}

async function fetchActiveMemberIdsByDevProject(
  projectIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (projectIds.length === 0) return map;

  const { data, error } = await supabase
    .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
    .select("project_id, member_id")
    .in("project_id", projectIds)
    .is("ended_at", null);

  if (error) throw error;

  for (const row of data ?? []) {
    const current = map.get(row.project_id) ?? [];
    current.push(row.member_id);
    map.set(row.project_id, current);
  }
  return map;
}

function toColumns(input: CreateDevProjectInput) {
  return {
    project_name: input.projectName,
    client_id: input.clientId,
    manager_id: input.managerId,
    description: input.description ?? null,
    tech_stack: input.techStack ?? null,
    repo_url: input.repoUrl ?? null,
    staging_url: input.stagingUrl ?? null,
    production_url: input.productionUrl ?? null,
    start_date: input.startDate || null,
    target_date: input.targetDate || null,
  };
}

async function syncDevProjectTeamMembers(
  projectId: string,
  managerId: string,
  teamMemberIds: string[],
): Promise<void> {
  const desiredIds = [...new Set(teamMemberIds)].filter(
    (memberId) => memberId && memberId !== managerId,
  );

  const { data: existingRows, error } = await supabase
    .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
    .select("id, member_id, ended_at")
    .eq("project_id", projectId);

  if (error) throw error;

  const rows = existingRows ?? [];
  const activeRows = rows.filter((row) => row.ended_at === null);
  const activeIds = new Set(activeRows.map((row) => row.member_id));
  const desiredSet = new Set(desiredIds);

  for (const row of activeRows) {
    if (!desiredSet.has(row.member_id)) {
      await supabase
        .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
        .update({ ended_at: new Date().toISOString() })
        .eq("id", row.id);
    }
  }

  for (const memberId of desiredIds) {
    if (activeIds.has(memberId)) continue;

    const endedRow = rows.find(
      (row) => row.member_id === memberId && row.ended_at !== null,
    );

    if (endedRow) {
      await supabase
        .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
        .update({ ended_at: null, started_at: new Date().toISOString() })
        .eq("id", endedRow.id);
    } else {
      await supabase
        .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
        .insert({ project_id: projectId, member_id: memberId });
    }
  }
}

export async function fetchDevProjects(): Promise<DevProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .select(DB.DEV_PROJECTS.SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as unknown as DevProjectRow[];
  const teamMap = await fetchActiveMemberIdsByDevProject(rows.map((r) => r.id));
  return rows.map((row) =>
    normalizeDevProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchAssignedDevProjectIds(
  teamMemberId: string,
): Promise<string[]> {
  const [managedResult, assignedResult] = await Promise.all([
    supabase
      .from(DB.DEV_PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.DEV_PROJECT_TEAM_MEMBERS.TABLE)
      .select("project_id")
      .eq("member_id", teamMemberId)
      .is("ended_at", null),
  ]);

  if (managedResult.error) throw managedResult.error;
  if (assignedResult.error) throw assignedResult.error;

  const ids = new Set<string>();
  for (const row of managedResult.data ?? []) ids.add(row.id);
  for (const row of assignedResult.data ?? []) ids.add(row.project_id);
  return [...ids];
}

async function fetchDevProjectsByIds(
  projectIds: string[],
): Promise<DevProjectListItem[]> {
  if (projectIds.length === 0) return [];

  const { data, error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .select(DB.DEV_PROJECTS.SELECT)
    .in("id", projectIds)
    .order("project_name", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as unknown as DevProjectRow[];
  const teamMap = await fetchActiveMemberIdsByDevProject(rows.map((r) => r.id));
  return rows.map((row) =>
    normalizeDevProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchDevProjectsScoped(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<DevProjectListItem[]> {
  if (seesAllProjects(teamRole)) {
    return fetchDevProjects();
  }

  if (!teamMemberId) return [];
  return fetchDevProjectsByIds(await fetchAssignedDevProjectIds(teamMemberId));
}

export async function fetchDevProjectsByClientId(
  clientId: string,
): Promise<DevProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .select(DB.DEV_PROJECTS.SELECT)
    .eq("client_id", clientId)
    .order("project_name", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as unknown as DevProjectRow[];
  const teamMap = await fetchActiveMemberIdsByDevProject(rows.map((r) => r.id));
  return rows.map((row) =>
    normalizeDevProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchDevProjectById(
  projectId: string,
): Promise<DevProjectListItem | null> {
  const { data, error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .select(DB.DEV_PROJECTS.SELECT)
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const teamMap = await fetchActiveMemberIdsByDevProject([projectId]);
  return normalizeDevProjectRow(
    data as unknown as DevProjectRow,
    teamMap.get(projectId) ?? [],
  );
}

export async function createDevProject(
  input: CreateDevProjectInput,
): Promise<DevProjectListItem> {
  const { data, error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .insert(toColumns(input))
    .select("id")
    .single();

  if (error) throw error;
  await syncDevProjectTeamMembers(
    data.id,
    input.managerId,
    input.teamMemberIds ?? [],
  );
  return (await fetchDevProjectById(data.id))!;
}

export async function updateDevProject(
  projectId: string,
  input: UpdateDevProjectInput,
): Promise<DevProjectListItem> {
  const { error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .update({
      ...toColumns(input),
      ...(typeof input.isActive === "boolean"
        ? { is_active: input.isActive }
        : {}),
    })
    .eq("id", projectId);

  if (error) throw error;
  await syncDevProjectTeamMembers(
    projectId,
    input.managerId,
    input.teamMemberIds ?? [],
  );
  return (await fetchDevProjectById(projectId))!;
}

export async function deleteDevProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.DEV_PROJECTS.TABLE)
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}
