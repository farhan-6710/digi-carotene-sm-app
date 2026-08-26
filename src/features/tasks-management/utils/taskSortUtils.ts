import type { TaskSortId } from "@/features/tasks-management/constants/taskSort";
import type {
  Task,
  TaskPriority,
} from "@/features/tasks-management/types/types";

const PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function compareEta(a: Task, b: Task): number {
  const byDate = a.eta_date.localeCompare(b.eta_date);
  if (byDate !== 0) return byDate;
  return a.eta_time.localeCompare(b.eta_time);
}

function comparePriority(a: Task, b: Task): number {
  return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
}

export function sortTasks(tasks: Task[], sort: TaskSortId): Task[] {
  const next = [...tasks];
  next.sort((a, b) => {
    switch (sort) {
      case "eta_asc":
        return compareEta(a, b);
      case "eta_desc":
        return compareEta(b, a);
      case "priority_asc":
        return comparePriority(a, b) || compareEta(a, b);
      case "priority_desc":
        return comparePriority(b, a) || compareEta(a, b);
      case "title_asc":
        return a.title.localeCompare(b.title) || compareEta(a, b);
      case "newest":
        return b.created_at.localeCompare(a.created_at);
      case "oldest":
        return a.created_at.localeCompare(b.created_at);
      default:
        return compareEta(a, b);
    }
  });
  return next;
}
