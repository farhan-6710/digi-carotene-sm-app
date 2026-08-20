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

export type TaskFormValues = {
  projectId: string;
  title: string;
  description: string;
  assignedToTeamMemberId: string;
  taggedTeamMemberIds: string[];
  priority: TaskPriority;
  eta: PostDateTimeValue | null;
  status: TaskStatus;
};

export const emptyTaskFormValues = (): TaskFormValues => ({
  projectId: "",
  title: "",
  description: "",
  assignedToTeamMemberId: "",
  taggedTeamMemberIds: [],
  priority: "normal",
  eta: null,
  status: "pending",
});

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    projectId: task.project_id,
    title: task.title,
    description: task.description ?? "",
    assignedToTeamMemberId: task.assigned_to_team_member_id,
    taggedTeamMemberIds: task.tagged_members.map((member) => member.id),
    priority: task.priority,
    eta: toPostDateTimeValue(task.eta_date, task.eta_time),
    status: task.status,
  };
}

export function validateTaskForm(values: TaskFormValues): string | null {
  if (!values.projectId) return "Select a project.";
  if (!values.title.trim()) return "Enter a title.";
  if (!values.assignedToTeamMemberId) return "Select an assignee.";
  if (!toRepositoryDateTime(values.eta)) {
    return "ETA requires both date and time.";
  }
  return null;
}
