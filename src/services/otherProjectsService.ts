import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  CreateOtherProjectInput,
  OtherProjectListItem,
  UpdateOtherProjectInput,
} from "@/features/other-projects/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import { seesAllProjects } from "@/shared/utils/rbac";
import { withAdminTeamMemberIds } from "@/services/teamMembersService";

type OtherProjectRow = {
  id: string;
  project_name: string;
  client_id: string;
  manager_id: string;
  description: string | null;
  start_date: string | null;
  eta_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clients: OtherProjectListItem["clients"] | OtherProjectListItem["clients"][];
  team_members:
    | OtherProjectListItem["team_members"]
    | OtherProjectListItem["team_members"][];
};

function normalizeOtherProjectRow(
  row: OtherProjectRow,
  teamMemberIds: string[] = [],
): OtherProjectListItem {
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
    start_date: row.start_date,
    eta_date: row.eta_date,
    is_active: row.is_active ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at,
    clients: client,
    team_members: manager,
    team_member_ids: teamMemberIds,
  };
}

async function fetchActiveMemberIdsByOtherProject(
  projectIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (projectIds.length === 0) return map;

  const { data, error } = await supabase
    .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
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

function toColumns(input: CreateOtherProjectInput) {
  return {
    project_name: input.projectName,
    client_id: input.clientId,
    manager_id: input.managerId,
    description: input.description ?? null,
    start_date: input.startDate || null,
    eta_date: input.etaDate || null,
  };
}

async function syncOtherProjectTeamMembers(
  projectId: string,
  managerId: string,
  teamMemberIds: string[],
): Promise<void> {
  const desiredIds = [...new Set(teamMemberIds)].filter(
    (memberId) => memberId && memberId !== managerId,
  );

  const { data: existingRows, error } = await supabase
    .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
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
        .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
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
        .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
        .update({ ended_at: null, started_at: new Date().toISOString() })
        .eq("id", endedRow.id);
    } else {
      await supabase
        .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
        .insert({ project_id: projectId, member_id: memberId });
    }
  }
}

export async function fetchOtherProjects(): Promise<OtherProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .select(DB.OTHER_PROJECTS.SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as unknown as OtherProjectRow[];
  const teamMap = await fetchActiveMemberIdsByOtherProject(
    rows.map((r) => r.id),
  );
  return rows.map((row) =>
    normalizeOtherProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchAssignedOtherProjectIds(
  teamMemberId: string,
): Promise<string[]> {
  const [managedResult, assignedResult] = await Promise.all([
    supabase
      .from(DB.OTHER_PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.OTHER_PROJECT_TEAM_MEMBERS.TABLE)
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

async function fetchOtherProjectsByIds(
  projectIds: string[],
): Promise<OtherProjectListItem[]> {
  if (projectIds.length === 0) return [];

  const { data, error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .select(DB.OTHER_PROJECTS.SELECT)
    .in("id", projectIds)
    .order("project_name", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as unknown as OtherProjectRow[];
  const teamMap = await fetchActiveMemberIdsByOtherProject(
    rows.map((r) => r.id),
  );
  return rows.map((row) =>
    normalizeOtherProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchOtherProjectsScoped(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<OtherProjectListItem[]> {
  if (seesAllProjects(teamRole)) {
    return fetchOtherProjects();
  }

  if (!teamMemberId) return [];
  return fetchOtherProjectsByIds(
    await fetchAssignedOtherProjectIds(teamMemberId),
  );
}

export async function fetchOtherProjectsByClientId(
  clientId: string,
): Promise<OtherProjectListItem[]> {
  const { data, error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .select(DB.OTHER_PROJECTS.SELECT)
    .eq("client_id", clientId)
    .order("project_name", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as unknown as OtherProjectRow[];
  const teamMap = await fetchActiveMemberIdsByOtherProject(
    rows.map((r) => r.id),
  );
  return rows.map((row) =>
    normalizeOtherProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchOtherProjectById(
  projectId: string,
): Promise<OtherProjectListItem | null> {
  const { data, error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .select(DB.OTHER_PROJECTS.SELECT)
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const teamMap = await fetchActiveMemberIdsByOtherProject([projectId]);
  return normalizeOtherProjectRow(
    data as unknown as OtherProjectRow,
    teamMap.get(projectId) ?? [],
  );
}

export async function createOtherProject(
  input: CreateOtherProjectInput,
): Promise<OtherProjectListItem> {
  const { data, error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .insert(toColumns(input))
    .select("id")
    .single();

  if (error) throw error;
  await syncOtherProjectTeamMembers(
    data.id,
    input.managerId,
    await withAdminTeamMemberIds(input.teamMemberIds ?? []),
  );
  return (await fetchOtherProjectById(data.id))!;
}

export async function updateOtherProject(
  projectId: string,
  input: UpdateOtherProjectInput,
): Promise<OtherProjectListItem> {
  const { error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .update({
      ...toColumns(input),
      ...(typeof input.isActive === "boolean"
        ? { is_active: input.isActive }
        : {}),
    })
    .eq("id", projectId);

  if (error) throw error;
  await syncOtherProjectTeamMembers(
    projectId,
    input.managerId,
    await withAdminTeamMemberIds(input.teamMemberIds ?? []),
  );
  return (await fetchOtherProjectById(projectId))!;
}

export async function deleteOtherProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.OTHER_PROJECTS.TABLE)
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}
