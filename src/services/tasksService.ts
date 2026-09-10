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
import { fetchAssignedDevProjectIds } from "@/services/devProjectsService";
import { DB } from "@/services/db";
import { fetchAssignedOtherProjectIds } from "@/services/otherProjectsService";
import { fetchAssignedProjectIds } from "@/services/projectsService";
import { supabase } from "@/services/supabaseClient";
import { isAdminOrManagerRole } from "@/shared/utils/rbac";

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

async function fetchTaggedTaskIds(teamMemberId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.TASK_TAGS.TABLE)
    .select("task_id")
    .eq("team_member_id", teamMemberId);

  if (error) throw error;
  return (data ?? []).map((row) => row.task_id);
}


async function fetchAssignedTaskIdsForMember(
  teamMemberId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.TASK_ASSIGNEES.TABLE)
    .select("task_id")
    .eq("team_member_id", teamMemberId);

  if (error) throw error;
  return (data ?? []).map((row) => row.task_id);
}

async function fetchProjectIdsForClient(clientId: string): Promise<{
  smProjectIds: string[];
  devProjectIds: string[];
  otherProjectIds: string[];
}> {
  const [smResult, devResult, otherResult] = await Promise.all([
    supabase.from(DB.PROJECTS.TABLE).select("id").eq("client_id", clientId),
    supabase.from(DB.DEV_PROJECTS.TABLE).select("id").eq("client_id", clientId),
    supabase
      .from(DB.OTHER_PROJECTS.TABLE)
      .select("id")
      .eq("client_id", clientId),
  ]);

  if (smResult.error) throw smResult.error;
  if (devResult.error) throw devResult.error;
  if (otherResult.error) throw otherResult.error;

  return {
    smProjectIds: (smResult.data ?? []).map((row) => row.id),
    devProjectIds: (devResult.data ?? []).map((row) => row.id),
    otherProjectIds: (otherResult.data ?? []).map((row) => row.id),
  };
}

export async function fetchTasksForClient(
  clientId: string | null,
): Promise<Task[]> {
  if (!clientId) return [];

  const { smProjectIds, devProjectIds, otherProjectIds } =
    await fetchProjectIdsForClient(clientId);

  const [smTasks, devTasks, otherTasks] = await Promise.all([
    smProjectIds.length > 0
      ? supabase
          .from(DB.TASKS.TABLE)
          .select(DB.TASKS.SELECT)
          .in("sm_project_id", smProjectIds)
          .order("updated_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    devProjectIds.length > 0
      ? supabase
          .from(DB.TASKS.TABLE)
          .select(DB.TASKS.SELECT)
          .in("dev_project_id", devProjectIds)
          .order("updated_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    otherProjectIds.length > 0
      ? supabase
          .from(DB.TASKS.TABLE)
          .select(DB.TASKS.SELECT)
          .in("other_project_id", otherProjectIds)
          .order("updated_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (smTasks.error) throw smTasks.error;
  if (devTasks.error) throw devTasks.error;
  if (otherTasks.error) throw otherTasks.error;

  return mergeTasksById([
    (smTasks.data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow)),
    (devTasks.data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow)),
    (otherTasks.data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow)),
  ]);
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

async function replaceTaskAssignees(
  taskId: string,
  teamMemberIds: string[],
  clientIds: string[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.TASK_ASSIGNEES.TABLE)
    .delete()
    .eq("task_id", taskId);

  if (deleteError) throw deleteError;

  const teamRows = [...new Set(teamMemberIds)].filter(Boolean).map((id) => ({
    task_id: taskId,
    team_member_id: id,
    client_id: null,
  }));
  const clientRows = [...new Set(clientIds)].filter(Boolean).map((id) => ({
    task_id: taskId,
    team_member_id: null,
    client_id: id,
  }));
  const rows = [...teamRows, ...clientRows];
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.TASK_ASSIGNEES.TABLE)
    .insert(rows);

  if (insertError) throw insertError;
}

function syncAssigneeColumns(
  teamMemberIds: string[],
  clientIds: string[],
): {
  assigned_to_team_member_id: string | null;
  client_id: string | null;
} {
  return {
    assigned_to_team_member_id: teamMemberIds[0] ?? null,
    client_id: clientIds[0] ?? null,
  };
}

async function notifyTaskCreated(
  task: Task,
  taggedTeamMemberIds: string[],
): Promise<void> {
  const recipientIds = new Set<string>();
  for (const assignee of task.assignees) {
    if (assignee.team_member_id) recipientIds.add(assignee.team_member_id);
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

async function fetchTasksOnProjects(
  smProjectIds: string[],
  devProjectIds: string[],
  otherProjectIds: string[] = [],
): Promise<Task[]> {
  if (
    smProjectIds.length === 0 &&
    devProjectIds.length === 0 &&
    otherProjectIds.length === 0
  ) {
    return [];
  }

  const filters: string[] = [];
  if (smProjectIds.length > 0) {
    filters.push(`sm_project_id.in.(${smProjectIds.join(",")})`);
  }
  if (devProjectIds.length > 0) {
    filters.push(`dev_project_id.in.(${devProjectIds.join(",")})`);
  }
  if (otherProjectIds.length > 0) {
    filters.push(`other_project_id.in.(${otherProjectIds.join(",")})`);
  }

  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .or(filters.join(","))
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapTaskRow(row as unknown as TaskRow));
}

async function fetchManagedProjectIds(
  teamMemberId: string,
): Promise<{ sm: string[]; dev: string[]; other: string[] }> {
  const [smResult, devResult, otherResult] = await Promise.all([
    supabase
      .from(DB.PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.DEV_PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
    supabase
      .from(DB.OTHER_PROJECTS.TABLE)
      .select("id")
      .eq("manager_id", teamMemberId),
  ]);

  if (smResult.error) throw smResult.error;
  if (devResult.error) throw devResult.error;
  if (otherResult.error) throw otherResult.error;

  return {
    sm: (smResult.data ?? []).map((row) => row.id),
    dev: (devResult.data ?? []).map((row) => row.id),
    other: (otherResult.data ?? []).map((row) => row.id),
  };
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

  // Team-role managers: all tasks on assigned SM/Dev/Other projects.
  if (isAdminOrManagerRole(teamRole)) {
    const [smProjectIds, devProjectIds, otherProjectIds] = await Promise.all([
      fetchAssignedProjectIds(teamMemberId),
      fetchAssignedDevProjectIds(teamMemberId),
      fetchAssignedOtherProjectIds(teamMemberId),
    ]);
    return fetchTasksOnProjects(smProjectIds, devProjectIds, otherProjectIds);
  }

  // Executives (and others): raised / assigned / deps, plus projects they manage.
  const [raisedResult, assignedIds, taggedIds, managed] = await Promise.all([
    supabase
      .from(DB.TASKS.TABLE)
      .select(DB.TASKS.SELECT)
      .eq("created_by_team_member_id", teamMemberId)
      .order("updated_at", { ascending: false }),
    fetchAssignedTaskIdsForMember(teamMemberId),
    fetchTaggedTaskIds(teamMemberId),
    fetchManagedProjectIds(teamMemberId),
  ]);

  if (raisedResult.error) throw raisedResult.error;

  const raised = (raisedResult.data ?? []).map((row) =>
    mapTaskRow(row as unknown as TaskRow),
  );
  const [assigned, tagged, managedTasks] = await Promise.all([
    fetchTasksByIds(assignedIds),
    fetchTasksByIds(taggedIds),
    fetchTasksOnProjects(managed.sm, managed.dev, managed.other),
  ]);

  return mergeTasksById([raised, assigned, tagged, managedTasks]);
}

function resolveTaskProjectIds(input: {
  smProjectId?: string | null;
  devProjectId?: string | null;
  otherProjectId?: string | null;
}): {
  sm_project_id: string | null;
  dev_project_id: string | null;
  other_project_id: string | null;
} {
  const smProjectId = input.smProjectId?.trim() || null;
  const devProjectId = input.devProjectId?.trim() || null;
  const otherProjectId = input.otherProjectId?.trim() || null;
  const setCount = [smProjectId, devProjectId, otherProjectId].filter(
    Boolean,
  ).length;

  if (setCount === 0) {
    throw new Error("Select a project.");
  }
  if (setCount > 1) {
    throw new Error("A task can belong to only one project.");
  }

  return {
    sm_project_id: smProjectId,
    dev_project_id: devProjectId,
    other_project_id: otherProjectId,
  };
}

export async function createTask(
  input: CreateTaskInput,
  createdByTeamMemberId: string,
): Promise<Task> {
  const teamMemberIds = input.assigneeTeamMemberIds ?? [];
  const clientIds = input.assigneeClientIds ?? [];
  if (teamMemberIds.length === 0 && clientIds.length === 0) {
    throw new Error("Assign the task to at least one teammate or client.");
  }

  const sync = syncAssigneeColumns(teamMemberIds, clientIds);
  const projectIds = resolveTaskProjectIds(input);

  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .insert({
      ...projectIds,
      client_id: sync.client_id,
      dependency_client_id: input.dependencyClientId?.trim() || null,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      created_by_team_member_id: createdByTeamMemberId,
      assigned_to_team_member_id: sync.assigned_to_team_member_id,
      priority: input.priority,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;

  await replaceTaskAssignees(data.id, teamMemberIds, clientIds);

  const assigneeIdSet = new Set(teamMemberIds);
  const taggedIds = (input.taggedTeamMemberIds ?? []).filter(
    (id) => id && !assigneeIdSet.has(id),
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
  if (
    input.smProjectId !== undefined ||
    input.devProjectId !== undefined ||
    input.otherProjectId !== undefined
  ) {
    const projectIds = resolveTaskProjectIds({
      smProjectId: input.smProjectId ?? null,
      devProjectId: input.devProjectId ?? null,
      otherProjectId: input.otherProjectId ?? null,
    });
    cols.sm_project_id = projectIds.sm_project_id;
    cols.dev_project_id = projectIds.dev_project_id;
    cols.other_project_id = projectIds.other_project_id;
  }
  if (input.dependencyClientId !== undefined) {
    cols.dependency_client_id = input.dependencyClientId?.trim() || null;
  }
  if (input.title !== undefined) cols.title = input.title.trim();
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.priority !== undefined) cols.priority = input.priority;
  if (input.etaDate !== undefined) cols.eta_date = input.etaDate;
  if (input.etaTime !== undefined) cols.eta_time = input.etaTime;
  if (input.status !== undefined) cols.status = input.status;

  if (
    input.assigneeTeamMemberIds !== undefined ||
    input.assigneeClientIds !== undefined
  ) {
    const teamMemberIds = input.assigneeTeamMemberIds ?? [];
    const clientIds = input.assigneeClientIds ?? [];
    if (teamMemberIds.length === 0 && clientIds.length === 0) {
      throw new Error("Assign the task to at least one teammate or client.");
    }
    const sync = syncAssigneeColumns(teamMemberIds, clientIds);
    cols.assigned_to_team_member_id = sync.assigned_to_team_member_id;
    cols.client_id = sync.client_id;
    await replaceTaskAssignees(taskId, teamMemberIds, clientIds);
  }

  if (Object.keys(cols).length > 0) {
    const { error } = await supabase
      .from(DB.TASKS.TABLE)
      .update(cols)
      .eq("id", taskId);

    if (error) throw error;
  }

  if (input.taggedTeamMemberIds !== undefined) {
    const assigneeIds =
      input.assigneeTeamMemberIds ??
      (
        await supabase
          .from(DB.TASK_ASSIGNEES.TABLE)
          .select("team_member_id")
          .eq("task_id", taskId)
          .not("team_member_id", "is", null)
      ).data?.map((row) => row.team_member_id as string) ??
      [];

    const assigneeIdSet = new Set(assigneeIds);
    const taggedIds = input.taggedTeamMemberIds.filter(
      (id) => id && !assigneeIdSet.has(id),
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
