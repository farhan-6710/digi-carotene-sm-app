import type { TaskStatusFilterId } from "@/features/tasks-management/constants/taskStatusFilter";
import type { Task } from "@/features/tasks-management/types/types";

export function filterTasksByStatus(
  tasks: Task[],
  statusFilter: TaskStatusFilterId,
): Task[] {
  if (statusFilter === "all") return tasks;
  if (statusFilter === "incomplete") {
    return tasks.filter((task) => task.status !== "completed");
  }
  return tasks.filter((task) => task.status === statusFilter);
}
