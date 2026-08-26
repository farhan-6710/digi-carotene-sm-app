import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import { encodeProjectKey } from "@/features/projects-management/utils/projectKindUtils";
import {
  toPostDateTimeValue,
  toRepositoryDateTime,
} from "@/features/posts-management/utils/postScheduleUtils";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks-management/types/types";
import { assigneeKeysFromTask } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { dependencyKeysFromTask } from "@/features/tasks-management/utils/taskDependencyUtils";

export type TaskFormValues = {
  /** Encoded `sm:<id>` or `dev:<id>` key. */
  projectId: string;
  /** Encoded `team:<id>` / `client:<id>` keys. */
  assigneeKeys: string[];
  title: string;
  description: string;
  /** Encoded dependency keys: `team:<id>` and/or `client:<id>`. */
  dependencyKeys: string[];
  priority: TaskPriority;
  eta: PostDateTimeValue | null;
  status: TaskStatus;
};

export const emptyTaskFormValues = (): TaskFormValues => ({
  projectId: "",
  assigneeKeys: [],
  title: "",
  description: "",
  dependencyKeys: [],
  priority: "medium",
  eta: null,
  status: "pending",
});

export function taskToFormValues(task: Task): TaskFormValues {
  const projectKey = task.dev_project_id
    ? encodeProjectKey("dev", task.dev_project_id)
    : task.project_id
      ? encodeProjectKey("sm", task.project_id)
      : "";

  return {
    projectId: projectKey,
    assigneeKeys: assigneeKeysFromTask(task),
    title: task.title,
    description: task.description ?? "",
    dependencyKeys: dependencyKeysFromTask(task),
    priority: task.priority,
    eta: toPostDateTimeValue(task.eta_date, task.eta_time),
    status: task.status,
  };
}

export function validateTaskForm(values: TaskFormValues): string | null {
  if (!values.projectId) return "Select a project.";
  if (!values.title.trim()) return "Enter a title.";
  if (values.assigneeKeys.length === 0) {
    return "Assign to at least one teammate or client.";
  }
  if (!toRepositoryDateTime(values.eta)) {
    return "ETA requires both date and time.";
  }
  return null;
}
