import { supabase } from "@/shared/lib/supabase";
import type {
  ProjectListItem,
  ProjectSocials,
} from "@/features/projects-management/types/types";

const projectListSelect = `
  id,
  project_name,
  client_id,
  socials,
  manager_id,
  created_at,
  updated_at,
  clients ( id, client_name ),
  team_members:manager_id ( id, member_name, admin_team_role )
`;

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

function normalizeProjectRow(row: ProjectRow, teamMemberIds: string[] = []): ProjectListItem {
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

async function fetchActiveTeamMemberIdsByProject(
  projectIds: string[],
): Promise<Map<string, string[]>> {
  if (projectIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("project_team_members")
    .select("project_id, member_id")
    .in("project_id", projectIds)
    .is("ended_at", null);

  if (error) {
    throw error;
  }

  const map = new Map<string, string[]>();

  for (const row of data ?? []) {
    const current = map.get(row.project_id) ?? [];
    current.push(row.member_id);
    map.set(row.project_id, current);
  }

  return map;
}

export async function fetchProjects(): Promise<ProjectListItem[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectListSelect)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as ProjectRow[];
  const teamMap = await fetchActiveTeamMemberIdsByProject(rows.map((row) => row.id));

  return rows.map((row) =>
    normalizeProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchProjectsByClientId(
  clientId: string,
): Promise<ProjectListItem[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectListSelect)
    .eq("client_id", clientId)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as ProjectRow[];
  const teamMap = await fetchActiveTeamMemberIdsByProject(rows.map((row) => row.id));

  return rows.map((row) =>
    normalizeProjectRow(row, teamMap.get(row.id) ?? []),
  );
}

export async function fetchProjectById(
  projectId: string,
): Promise<ProjectListItem | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectListSelect)
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const teamMap = await fetchActiveTeamMemberIdsByProject([projectId]);
  return normalizeProjectRow(data as unknown as ProjectRow, teamMap.get(projectId) ?? []);
}

export type CreateProjectInput = {
  projectName: string;
  clientId: string;
  managerId: string;
  socials?: ProjectSocials | null;
  teamMemberIds?: string[];
};

export type UpdateProjectInput = CreateProjectInput;

async function syncProjectTeamMembers(
  projectId: string,
  managerId: string,
  teamMemberIds: string[],
): Promise<void> {
  const uniqueMemberIds = [...new Set(teamMemberIds)].filter(
    (memberId) => memberId && memberId !== managerId,
  );

  const { data: existingRows, error: fetchError } = await supabase
    .from("project_team_members")
    .select("id, member_id, ended_at")
    .eq("project_id", projectId);

  if (fetchError) {
    throw fetchError;
  }

  const activeRows = (existingRows ?? []).filter((row) => row.ended_at === null);
  const activeMemberIds = new Set(activeRows.map((row) => row.member_id));
  const desiredMemberIds = new Set(uniqueMemberIds);

  for (const row of activeRows) {
    if (!desiredMemberIds.has(row.member_id)) {
      const { error } = await supabase
        .from("project_team_members")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", row.id);

      if (error) {
        throw error;
      }
    }
  }

  for (const memberId of uniqueMemberIds) {
    if (activeMemberIds.has(memberId)) {
      continue;
    }

    const endedRow = (existingRows ?? []).find(
      (row) => row.member_id === memberId && row.ended_at !== null,
    );

    if (endedRow) {
      const { error } = await supabase
        .from("project_team_members")
        .update({ ended_at: null, started_at: new Date().toISOString() })
        .eq("id", endedRow.id);

      if (error) {
        throw error;
      }
      continue;
    }

    const { error } = await supabase.from("project_team_members").insert({
      project_id: projectId,
      member_id: memberId,
    });

    if (error) {
      throw error;
    }
  }
}

export async function createProject(input: CreateProjectInput): Promise<ProjectListItem> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_name: input.projectName,
      client_id: input.clientId,
      manager_id: input.managerId,
      socials: input.socials || {},
    })
    .select(projectListSelect)
    .single();

  if (error) {
    throw error;
  }

  await syncProjectTeamMembers(
    data.id,
    input.managerId,
    input.teamMemberIds ?? [],
  );

  return (await fetchProjectById(data.id))!;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<ProjectListItem> {
  const { error } = await supabase
    .from("projects")
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

  await syncProjectTeamMembers(
    projectId,
    input.managerId,
    input.teamMemberIds ?? [],
  );

  return (await fetchProjectById(projectId))!;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This project has scheduled posts. Remove or reassign those posts first.",
      );
    }

    throw new Error(error.message ?? "Failed to delete project.");
  }
}

export async function fetchPostsCountForProject(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return count ?? 0;
}
