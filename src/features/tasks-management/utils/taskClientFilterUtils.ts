import type { Task } from "@/features/tasks-management/types/types";
import { TASKS_ALL_CLIENTS } from "@/features/tasks-management/constants/taskClientFilter";

export function getTaskClientId(task: Task): string | null {
  return task.projects?.clients?.id ?? task.client_id ?? task.client?.id ?? null;
}

export function getTaskClientName(task: Task): string | null {
  return (
    task.projects?.clients?.client_name ?? task.client?.client_name ?? null
  );
}

export function filterTasksByClient(
  tasks: Task[],
  clientId: string,
): Task[] {
  if (!clientId || clientId === TASKS_ALL_CLIENTS) return tasks;
  return tasks.filter((task) => getTaskClientId(task) === clientId);
}

export function buildTaskClientFilterOptions(
  tasks: Task[],
): { value: string; label: string }[] {
  const byId = new Map<string, string>();
  for (const task of tasks) {
    const id = getTaskClientId(task);
    const name = getTaskClientName(task);
    if (id && name) byId.set(id, name);
  }
  return Array.from(byId.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
