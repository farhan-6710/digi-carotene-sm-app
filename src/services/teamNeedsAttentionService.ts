import {
  buildSubtaskDetailPath,
  buildTaskDetailPath,
} from "@/features/tasks-management/constants/routes";
import { TASK_PRIORITY_LABELS } from "@/features/tasks-management/constants/taskPriorities";
import { TASK_STATUS_LABELS } from "@/features/tasks-management/constants/taskStatuses";
import type { Subtask, Task } from "@/features/tasks-management/types/types";
import {
  mapSubtaskRow,
  type SubtaskRow,
} from "@/features/tasks-management/utils/subtaskDb";
import {
  mapTaskRow,
  type TaskRow,
} from "@/features/tasks-management/utils/taskDb";
import type { TeamNeedsAttentionItem } from "@/features/team-portal/types/types";
import { compareWorkItemsByPriorityDesc } from "@/features/team-portal/utils/workItemSortUtils";
import { TASK_DIGEST_OPEN_STATUSES } from "@/shared/constants/taskDigestEmail";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

const OPEN_STATUSES = [...TASK_DIGEST_OPEN_STATUSES];

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

async function fetchRelevantTaskIds(teamMemberId: string): Promise<string[]> {
  const [assignees, tags] = await Promise.all([
    supabase
      .from(DB.TASK_ASSIGNEES.TABLE)
      .select("task_id")
      .eq("team_member_id", teamMemberId),
    supabase
      .from(DB.TASK_TAGS.TABLE)
      .select("task_id")
      .eq("team_member_id", teamMemberId),
  ]);

  if (assignees.error) {
    throw assignees.error;
  }
  if (tags.error) {
    throw tags.error;
  }

  return uniqueIds([
    ...(assignees.data ?? []).map((row) => row.task_id as string),
    ...(tags.data ?? []).map((row) => row.task_id as string),
  ]);
}

async function fetchAssignedSubtaskIds(teamMemberId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from(DB.SUBTASK_ASSIGNEES.TABLE)
    .select("subtask_id")
    .eq("team_member_id", teamMemberId);

  if (error) {
    throw error;
  }

  return uniqueIds((data ?? []).map((row) => row.subtask_id as string));
}

function buildTaskLabel(task: Task): string {
  const projectName = task.projects?.project_name ?? "Task";
  return `${projectName} · ${task.title}`;
}

function buildSubtaskLabel(subtask: Subtask): string {
  return `Subtask · ${subtask.title}`;
}

function buildScheduleLabel(etaDate: string, etaTime: string): string {
  return `${etaDate} · ${etaTime}`;
}

function mapTaskToNeedsAttention(task: Task): TeamNeedsAttentionItem {
  return {
    id: task.id,
    kind: "task",
    label: buildTaskLabel(task),
    priority: task.priority,
    priorityLabel: TASK_PRIORITY_LABELS[task.priority],
    statusLabel: TASK_STATUS_LABELS[task.status],
    scheduleLabel: buildScheduleLabel(task.eta_date, task.eta_time),
    href: buildTaskDetailPath(task.id),
  };
}

function mapSubtaskToNeedsAttention(subtask: Subtask): TeamNeedsAttentionItem {
  return {
    id: subtask.id,
    kind: "subtask",
    label: buildSubtaskLabel(subtask),
    priority: subtask.priority,
    priorityLabel: TASK_PRIORITY_LABELS[subtask.priority],
    statusLabel: TASK_STATUS_LABELS[subtask.status],
    scheduleLabel: buildScheduleLabel(subtask.eta_date, subtask.eta_time),
    href: buildSubtaskDetailPath(subtask.parent_task_id, subtask.id),
  };
}

export async function fetchTeamNeedsAttentionItems(
  teamMemberId: string,
): Promise<TeamNeedsAttentionItem[]> {
  const [taskIds, subtaskIds] = await Promise.all([
    fetchRelevantTaskIds(teamMemberId),
    fetchAssignedSubtaskIds(teamMemberId),
  ]);

  const [tasksResult, subtasksResult] = await Promise.all([
    taskIds.length === 0
      ? Promise.resolve([] as Task[])
      : supabase
          .from(DB.TASKS.TABLE)
          .select(DB.TASKS.SELECT)
          .in("id", taskIds)
          .in("status", OPEN_STATUSES)
          .then(({ data, error }) => {
            if (error) {
              throw error;
            }
            return (data ?? []).map((row) =>
              mapTaskRow(row as unknown as TaskRow),
            );
          }),
    subtaskIds.length === 0
      ? Promise.resolve([] as Subtask[])
      : supabase
          .from(DB.SUBTASKS.TABLE)
          .select(DB.SUBTASKS.SELECT)
          .in("id", subtaskIds)
          .in("status", OPEN_STATUSES)
          .then(({ data, error }) => {
            if (error) {
              throw error;
            }
            return (data ?? []).map((row) =>
              mapSubtaskRow(row as unknown as SubtaskRow),
            );
          }),
  ]);

  const rawItems: Array<
    | { kind: "task"; task: Task }
    | { kind: "subtask"; subtask: Subtask }
  > = [
    ...tasksResult.map((task) => ({ kind: "task" as const, task })),
    ...subtasksResult.map((subtask) => ({ kind: "subtask" as const, subtask })),
  ];

  rawItems.sort((a, b) => {
    const left = a.kind === "task" ? a.task : a.subtask;
    const right = b.kind === "task" ? b.task : b.subtask;
    return compareWorkItemsByPriorityDesc(left, right);
  });

  return rawItems.map((entry) =>
    entry.kind === "task"
      ? mapTaskToNeedsAttention(entry.task)
      : mapSubtaskToNeedsAttention(entry.subtask),
  );
}
