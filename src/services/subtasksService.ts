import type {
  CreateSubtaskInput,
  Subtask,
  UpdateSubtaskInput,
} from "@/features/tasks-management/types/types";
import {
  mapSubtaskRow,
  type SubtaskRow,
} from "@/features/tasks-management/utils/subtaskDb";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

async function fetchSubtaskById(id: string): Promise<Subtask> {
  const { data, error } = await supabase
    .from(DB.SUBTASKS.TABLE)
    .select(DB.SUBTASKS.SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapSubtaskRow(data as unknown as SubtaskRow);
}

export async function getSubtaskById(id: string): Promise<Subtask> {
  return fetchSubtaskById(id);
}

async function replaceSubtaskAssignees(
  subtaskId: string,
  teamMemberIds: string[],
  clientIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.SUBTASK_ASSIGNEES.TABLE)
    .delete()
    .eq("subtask_id", subtaskId);

  if (deleteError) throw deleteError;

  const teamRows = [...new Set(teamMemberIds)].filter(Boolean).map((id) => ({
    subtask_id: subtaskId,
    team_member_id: id,
    client_id: null,
  }));
  const clientRows = [...new Set(clientIds)].filter(Boolean).map((id) => ({
    subtask_id: subtaskId,
    team_member_id: null,
    client_id: id,
  }));
  const rows = [...teamRows, ...clientRows];
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.SUBTASK_ASSIGNEES.TABLE)
    .insert(rows);

  if (insertError) throw insertError;
}

function syncSubtaskAssigneeColumns(
  teamMemberIds: string[],
  clientIds: string[],
): {
  assigned_to_team_member_id: string | null;
  assigned_to_client_id: string | null;
} {
  return {
    assigned_to_team_member_id: teamMemberIds[0] ?? null,
    assigned_to_client_id: clientIds[0] ?? null,
  };
}

export async function fetchSubtasksForTask(
  parentTaskId: string,
): Promise<Subtask[]> {
  const { data, error } = await supabase
    .from(DB.SUBTASKS.TABLE)
    .select(DB.SUBTASKS.SELECT)
    .eq("parent_task_id", parentTaskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapSubtaskRow(row as unknown as SubtaskRow),
  );
}

export async function createSubtask(
  input: CreateSubtaskInput,
  creator: { teamMemberId?: string | null; clientId?: string | null },
): Promise<Subtask> {
  const createdByTeamMemberId = creator.teamMemberId?.trim() || null;
  const createdByClientId = creator.clientId?.trim() || null;
  if (
    (createdByTeamMemberId && createdByClientId) ||
    (!createdByTeamMemberId && !createdByClientId)
  ) {
    throw new Error("Subtask creator must be a teammate or client.");
  }

  const teamMemberIds = input.assigneeTeamMemberIds ?? [];
  const clientIds = input.assigneeClientIds ?? [];
  if (teamMemberIds.length === 0 && clientIds.length === 0) {
    throw new Error("Assign the subtask to at least one teammate or client.");
  }

  const sync = syncSubtaskAssigneeColumns(teamMemberIds, clientIds);

  const { data, error } = await supabase
    .from(DB.SUBTASKS.TABLE)
    .insert({
      parent_task_id: input.parentTaskId,
      title: input.title.trim(),
      description: input.description.trim(),
      created_by_team_member_id: createdByTeamMemberId,
      created_by_client_id: createdByClientId,
      assigned_to_team_member_id: sync.assigned_to_team_member_id,
      assigned_to_client_id: sync.assigned_to_client_id,
      priority: input.priority,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  await replaceSubtaskAssignees(data.id, teamMemberIds, clientIds);
  return fetchSubtaskById(data.id);
}

export async function updateSubtask(
  id: string,
  input: UpdateSubtaskInput,
): Promise<Subtask> {
  const patch: Record<string, unknown> = {};

  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) {
    patch.description = input.description.trim();
  }
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.etaDate !== undefined) patch.eta_date = input.etaDate;
  if (input.etaTime !== undefined) patch.eta_time = input.etaTime;
  if (input.status !== undefined) patch.status = input.status;

  if (
    input.assigneeTeamMemberIds !== undefined ||
    input.assigneeClientIds !== undefined
  ) {
    const teamMemberIds = input.assigneeTeamMemberIds ?? [];
    const clientIds = input.assigneeClientIds ?? [];
    if (teamMemberIds.length === 0 && clientIds.length === 0) {
      throw new Error("Assign the subtask to at least one teammate or client.");
    }
    const sync = syncSubtaskAssigneeColumns(teamMemberIds, clientIds);
    patch.assigned_to_team_member_id = sync.assigned_to_team_member_id;
    patch.assigned_to_client_id = sync.assigned_to_client_id;
    await replaceSubtaskAssignees(id, teamMemberIds, clientIds);
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase
      .from(DB.SUBTASKS.TABLE)
      .update(patch)
      .eq("id", id);

    if (error) throw error;
  }

  return fetchSubtaskById(id);
}

export async function deleteSubtask(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.SUBTASKS.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
