import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  ManagedProject,
  ProjectTeamAssignment,
} from "@/features/projects-management/types/types";

type AssignmentRow = ProjectTeamAssignment & {
  projects: ProjectTeamAssignment["projects"] | ProjectTeamAssignment["projects"][];
};

function normalizeAssignment(row: AssignmentRow): ProjectTeamAssignment {
  const project = Array.isArray(row.projects) ? row.projects[0] ?? null : row.projects;
  return { ...row, projects: project };
}

export async function fetchMemberProjectAssignments(
  memberId: string,
): Promise<ProjectTeamAssignment[]> {
  const { data, error } = await supabase
    .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
    .select(DB.PROJECT_TEAM_MEMBERS.SELECT)
    .eq("member_id", memberId)
    .order("started_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => normalizeAssignment(row as unknown as AssignmentRow));
}

export async function fetchManagedProjects(
  memberId: string,
): Promise<ManagedProject[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("id, project_name, client_id, manager_id, clients ( id, client_name )")
    .eq("manager_id", memberId)
    .order("project_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const client = Array.isArray(row.clients) ? row.clients[0] ?? null : row.clients;
    return {
      id: row.id,
      project_name: row.project_name,
      client_id: row.client_id,
      manager_id: row.manager_id,
      clients: client,
    };
  }) as ManagedProject[];
}

export async function assignMemberToProject(
  memberId: string,
  projectId: string,
): Promise<ProjectTeamAssignment> {
  const { data: project, error: projectError } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("manager_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    throw projectError;
  }

  if (!project) {
    throw new Error("Project not found.");
  }

  if (project.manager_id === memberId) {
    throw new Error("This member is already the project manager.");
  }

  const { data, error } = await supabase
    .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
    .insert({ project_id: projectId, member_id: memberId })
    .select(DB.PROJECT_TEAM_MEMBERS.SELECT)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This team member is already actively assigned to this project.");
    }
    throw new Error(error.message ?? "Failed to save assignment.");
  }

  return normalizeAssignment(data as unknown as AssignmentRow);
}

export async function endProjectTeamAssignment(assignmentId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECT_TEAM_MEMBERS.TABLE)
    .update({ ended_at: new Date().toISOString() })
    .eq("id", assignmentId)
    .is("ended_at", null);

  if (error) {
    throw new Error(error.message ?? "Failed to end assignment.");
  }
}
