export const CLIENT_TASKS_PATH = "/client-portal/tasks-management";

export function buildClientTaskDetailPath(taskId: string): string {
  return `${CLIENT_TASKS_PATH}/${taskId}`;
}
