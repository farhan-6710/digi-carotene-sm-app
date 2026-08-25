import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import {
  toPostDateTimeValue,
  toRepositoryDateTime,
} from "@/features/posts-management/utils/postScheduleUtils";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks-management/types/types";
import {
  encodeTaskAssignee,
  parseTaskAssignee,
} from "@/features/tasks-management/utils/taskAssigneeUtils";
import { dependencyKeysFromTask } from "@/features/tasks-management/utils/taskDependencyUtils";

export type TaskFormValues = {
  projectId: string;
  /** Encoded `team:<id>` or `client:<id>`. */
  assigneeKey: string;
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
  assigneeKey: "",
  title: "",
  description: "",
  dependencyKeys: [],
  priority: "medium",
  eta: null,
  status: "pending",
});

export function taskToFormValues(task: Task): TaskFormValues {
  let assigneeKey = "";
  if (task.assigned_to_team_member_id) {
    assigneeKey = encodeTaskAssignee("team", task.assigned_to_team_member_id);
  } else if (task.client_id) {
    assigneeKey = encodeTaskAssignee("client", task.client_id);
  }

  return {
    projectId: task.project_id,
    assigneeKey,
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
  if (!parseTaskAssignee(values.assigneeKey)) {
    return "Select a teammate or client to assign.";
  }
  if (!toRepositoryDateTime(values.eta)) {
    return "ETA requires both date and time.";
  }
  return null;
}
