import type { PostDateTimeValue } from "@/features/posts-management/types/types";
import { toPostDateTimeValue } from "@/features/posts-management/utils/postScheduleUtils";
import type {
  TeamTodo,
  TeamTodoStatus,
} from "@/features/team-portal/types/types";

export type TeamTodoFormValues = {
  title: string;
  description: string;
  eta: PostDateTimeValue | null;
  status: TeamTodoStatus;
};

export const EMPTY_TEAM_TODO_FORM: TeamTodoFormValues = {
  title: "",
  description: "",
  eta: null,
  status: "pending",
};

export function teamTodoToFormValues(todo: TeamTodo): TeamTodoFormValues {
  return {
    title: todo.title,
    description: todo.description ?? "",
    eta: toPostDateTimeValue(todo.eta_date, todo.eta_time),
    status: todo.status,
  };
}
