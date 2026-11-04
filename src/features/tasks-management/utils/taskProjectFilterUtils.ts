import { encodeProjectKey } from "@/features/projects-management/utils/projectKindUtils";
import { TASKS_ALL_PROJECTS } from "@/features/tasks-management/constants/taskProjectFilter";
import type { Task } from "@/features/tasks-management/types/types";

export function getTaskProjectKey(task: Task): string | null {
  if (task.sm_project_id) return encodeProjectKey("sm", task.sm_project_id);
  if (task.dev_project_id) return encodeProjectKey("dev", task.dev_project_id);
  if (task.other_project_id) {
    return encodeProjectKey("other", task.other_project_id);
  }
  return null;
}

export function getTaskProjectLabel(task: Task): string | null {
  const name = task.projects?.project_name?.trim();
  if (!name) return null;
  const clientName = task.projects?.clients?.client_name?.trim();
  return clientName ? `${name} (${clientName})` : name;
}

export function filterTasksByProject(
  tasks: Task[],
  projectKey: string,
): Task[] {
  if (!projectKey || projectKey === TASKS_ALL_PROJECTS) return tasks;
  return tasks.filter((task) => getTaskProjectKey(task) === projectKey);
}

export function buildTaskProjectFilterOptions(
  tasks: Task[],
): { value: string; label: string }[] {
  const byKey = new Map<string, string>();
  for (const task of tasks) {
    const key = getTaskProjectKey(task);
    const label = getTaskProjectLabel(task);
    if (key && label) byKey.set(key, label);
  }
  return Array.from(byKey.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
