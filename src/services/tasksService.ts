import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";
import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "@/features/tasks-management/types/types";
import {
  mapTaskRow,
  type TaskRow,
} from "@/features/tasks-management/utils/taskDb";
import { createNotifications } from "@/services/notificationsService";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

async function fetchAdminTeamMemberIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.TEAM_MEMBERS.TABLE)
    .select("id")
    .eq("team_role", "admin");

  if (error) throw error;
  return (data ?? [])
    .map((row) => (typeof row.id === "string" ? row.id : ""))
    .filter(Boolean);
}

async function fetchManagedProjectIds(managerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("id")
    .eq("manager_id", managerId);

  if (error) throw error;
  return (data ?? []).map((row) => row.id);
}

async function fetchTaggedTaskIds(teamMemberId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.TASK_TAGS.TABLE)
    .select("task_id")
    .eq("team_member_id", teamMemberId);

  if (error) throw error;
  return (data ?? []).map((row) => row.task_id);
}

async function fetchTasksByIds(taskIds: string[]): Promise<Task[]> {
  if (taskIds.length === 0) return [];
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .in("id", taskIds)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow));
}

function mergeTasksById(lists: Task[][]): Task[] {
  const map = new Map<string, Task>();
  for (const list of lists) {
    for (const task of list) {
      map.set(task.id, task);
    }
  }
  return [...map.values()].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  );
}

async function replaceTaskTags(
  taskId: string,
  taggedTeamMemberIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.TASK_TAGS.TABLE)
    .delete()
    .eq("task_id", taskId);

  if (deleteError) throw deleteError;

  const uniqueIds = [...new Set(taggedTeamMemberIds)].filter(Boolean);
  if (uniqueIds.length === 0) return;

  const { error: insertError } = await supabase.from(DB.TASK_TAGS.TABLE).insert(
    uniqueIds.map((teamMemberId) => ({
      task_id: taskId,
      team_member_id: teamMemberId,
    })),
  );

  if (insertError) throw insertError;
}

async function notifyTaskCreated(
  task: Task,
  taggedTeamMemberIds: string[],
): Promise<void> {
  const recipientIds = new Set<string>();
  if (task.assigned_to_team_member_id) {
    recipientIds.add(task.assigned_to_team_member_id);
  }
  for (const id of taggedTeamMemberIds) {
    recipientIds.add(id);
  }

  const managerId = task.projects?.manager_id;
  if (managerId) {
    recipientIds.add(managerId);
  }

  for (const adminId of await fetchAdminTeamMemberIds()) {
    recipientIds.add(adminId);
  }

  recipientIds.delete(task.created_by_team_member_id);

  if (recipientIds.size === 0) return;

  const raiserName = task.created_by?.member_name ?? "A teammate";
  const projectLabel = task.projects?.project_name ?? "a project";
  const flags = [
    task.priority === "high"
      ? "High priority"
      : task.priority === "low"
        ? "Low priority"
        : null,
    task.eta_date && task.eta_time
      ? `ETA ${task.eta_date} · ${task.eta_time}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  await createNotifications(
    [...recipientIds].map((recipientTeamMemberId) => ({
      recipientTeamMemberId,
      notificationType: "task" as const,
      title: "New task",
      message: `${raiserName} raised “${task.title}” on ${projectLabel}${flags ? ` (${flags})` : ""}.`,
      relatedId: task.id,
    })),
  );
}

export async function fetchTasksForMember(
  teamRole: TeamMemberRole | null,
  teamMemberId: string | null,
): Promise<Task[]> {
  if (!teamMemberId) return [];

  if (teamRole === "admin") {
    const { data, error } = await supabase
      .from(DB.TASKS.TABLE)
      .select(DB.TASKS.SELECT)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow));
  }

  if (teamRole === "manager") {
    const managedIds = await fetchManagedProjectIds(teamMemberId);
    if (managedIds.length === 0) return [];

    const { data, error } = await supabase
      .from(DB.TASKS.TABLE)
      .select(DB.TASKS.SELECT)
      .in("project_id", managedIds)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow));
  }

  const [raisedResult, assignedResult, taggedIds] = await Promise.all([
    supabase
      .from(DB.TASKS.TABLE)
      .select(DB.TASKS.SELECT)
      .eq("created_by_team_member_id", teamMemberId)
      .order("updated_at", { ascending: false }),
    supabase
      .from(DB.TASKS.TABLE)
      .select(DB.TASKS.SELECT)
      .eq("assigned_to_team_member_id", teamMemberId)
      .order("updated_at", { ascending: false }),
    fetchTaggedTaskIds(teamMemberId),
  ]);

  if (raisedResult.error) throw raisedResult.error;
  if (assignedResult.error) throw assignedResult.error;

  const raised = (raisedResult.data ?? []).map((row) =>
    mapTaskRow(row as unknown as TaskRow),
  );
  const assigned = (assignedResult.data ?? []).map((row) =>
    mapTaskRow(row as unknown as TaskRow),
  );
  const tagged = await fetchTasksByIds(taggedIds);

  return mergeTasksById([raised, assigned, tagged]);
}

export async function createTask(
  input: CreateTaskInput,
  createdByTeamMemberId: string,
): Promise<Task> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .insert({
      project_id: input.projectId,
      client_id: input.clientId?.trim() || null,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      created_by_team_member_id: createdByTeamMemberId,
      assigned_to_team_member_id: input.assignedToTeamMemberId?.trim() || null,
      priority: input.priority,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
      status: "pending",
    })
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;

  const taggedIds = (input.taggedTeamMemberIds ?? []).filter(
    (id) => id && id !== input.assignedToTeamMemberId,
  );
  await replaceTaskTags(data.id, taggedIds);

  const { data: fullRow, error: reloadError } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("id", data.id)
    .single();

  if (reloadError) throw reloadError;

  const task = mapTaskRow(fullRow as unknown as TaskRow);
  await notifyTaskCreated(task, taggedIds);
  return task;
}

export async function updateTask(
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const cols: Record<string, unknown> = {};
  if (input.projectId !== undefined) cols.project_id = input.projectId;
  if (input.clientId !== undefined) {
    cols.client_id = input.clientId?.trim() || null;
  }
  if (input.title !== undefined) cols.title = input.title.trim();
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.assignedToTeamMemberId !== undefined) {
    cols.assigned_to_team_member_id =
      input.assignedToTeamMemberId?.trim() || null;
  }
  if (input.priority !== undefined) cols.priority = input.priority;
  if (input.etaDate !== undefined) cols.eta_date = input.etaDate;
  if (input.etaTime !== undefined) cols.eta_time = input.etaTime;
  if (input.status !== undefined) cols.status = input.status;

  if (Object.keys(cols).length > 0) {
    const { error } = await supabase
      .from(DB.TASKS.TABLE)
      .update(cols)
      .eq("id", taskId);

    if (error) throw error;
  }

  if (input.taggedTeamMemberIds !== undefined) {
    const assigneeId =
      input.assignedToTeamMemberId ??
      (
        await supabase
          .from(DB.TASKS.TABLE)
          .select("assigned_to_team_member_id")
          .eq("id", taskId)
          .single()
      ).data?.assigned_to_team_member_id;

    const taggedIds = input.taggedTeamMemberIds.filter(
      (id) => id && id !== assigneeId,
    );
    await replaceTaskTags(taskId, taggedIds);
  }

  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("id", taskId)
    .single();

  if (error) throw error;
  return mapTaskRow(data as unknown as TaskRow);
}

export async function fetchTasksForClient(
  clientId: string | null,
): Promise<Task[]> {
  if (!clientId) return [];

  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("client_id", clientId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow));
}

export async function fetchTaskById(taskId: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("id", taskId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapTaskRow(data as unknown as TaskRow);
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.TASKS.TABLE)
    .delete()
    .eq("id", taskId);

  if (error) throw error;
}
