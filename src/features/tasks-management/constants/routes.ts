export const TASKS_MANAGEMENT_PATH = "/team-portal/tasks-management";

export function buildTaskDetailPath(taskId: string): string {
  return `${TASKS_MANAGEMENT_PATH}/${taskId}`;
}

export function buildSubtaskDetailPath(
  taskId: string,
  subtaskId: string,
): string {
  return `${TASKS_MANAGEMENT_PATH}/${taskId}/subtasks/${subtaskId}`;
}
