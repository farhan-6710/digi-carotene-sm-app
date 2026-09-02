import { TASK_WORK_PRIORITY_RANK } from "@/shared/constants/taskDigestEmail";
import type { TaskPriority } from "@/features/tasks-management/types/types";

export type WorkItemSortFields = {
  priority: TaskPriority;
  eta_date: string;
  eta_time: string;
};

export function compareWorkItemsByPriority(
  a: WorkItemSortFields,
  b: WorkItemSortFields,
): number {
  const byPriority =
    TASK_WORK_PRIORITY_RANK[b.priority] - TASK_WORK_PRIORITY_RANK[a.priority];
  if (byPriority !== 0) {
    return byPriority;
  }

  const byDate = a.eta_date.localeCompare(b.eta_date);
  if (byDate !== 0) {
    return byDate;
  }

  return a.eta_time.localeCompare(b.eta_time);
}

export function compareWorkItemsByPriorityDesc(
  a: WorkItemSortFields,
  b: WorkItemSortFields,
): number {
  return compareWorkItemsByPriority(b, a);
}
