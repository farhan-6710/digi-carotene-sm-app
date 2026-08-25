import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import {
  toPostDateTimeValue,
  toRepositoryDateTime,
} from "@/features/posts-management/utils/postScheduleUtils";
import type {
  Subtask,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks-management/types/types";
import { assigneeKeysFromSubtask } from "@/features/tasks-management/utils/taskAssigneeListUtils";

export type SubtaskFormValues = {
  /** Encoded `team:<id>` or `client:<id>`. */
  assigneeKeys: string[];
  title: string;
  description: string;
  priority: TaskPriority;
  eta: PostDateTimeValue | null;
  status: TaskStatus;
};

export const emptySubtaskFormValues = (): SubtaskFormValues => ({
  assigneeKeys: [],
  title: "",
  description: "",
  priority: "medium",
  eta: null,
  status: "pending",
});

export function subtaskToFormValues(subtask: Subtask): SubtaskFormValues {
  return {
    assigneeKeys: assigneeKeysFromSubtask(subtask),
    title: subtask.title,
    description: subtask.description,
    priority: subtask.priority,
    eta: toPostDateTimeValue(subtask.eta_date, subtask.eta_time),
    status: subtask.status,
  };
}

export function validateSubtaskForm(
  values: SubtaskFormValues,
  options?: { statusOnly?: boolean },
): string | null {
  if (options?.statusOnly) return null;
  if (!values.title.trim()) return "Enter a title.";
  if (!values.description.trim()) return "Enter a description.";
  if (values.assigneeKeys.length === 0) {
    return "Assign to at least one teammate or client.";
  }
  if (!toRepositoryDateTime(values.eta)) {
    return "ETA requires both date and time.";
  }
  return null;
}
