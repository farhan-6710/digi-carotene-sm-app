import type { TaskTabId } from "@/features/tasks-management/constants/taskTabs";
import type {
  Task,
  TaskMessage,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks-management/types/types";
import type { TaskFormValues } from "@/features/tasks-management/utils/taskFormUtils";

export type TasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  canEditTask: (task: Task) => boolean;
  onEditTask: (task: Task) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  tab: TaskTabId;
  onTabChange: (tab: TaskTabId) => void;
};

export type TasksTableRowProps = {
  task: Task;
  canEdit: boolean;
  onEdit: (task: Task) => void;
};

export type TaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: TaskFormValues;
  onFieldChange: <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type TaskTabFilterProps = {
  value: TaskTabId;
  onChange: (tab: TaskTabId) => void;
  disabled?: boolean;
};

export type TaskPrioritySelectProps = {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  disabled?: boolean;
};

export type TaskStatusSelectProps = {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
};

export type TaskDetailSummaryProps = {
  task: Task;
};

export type TaskChatProps = {
  messages: TaskMessage[];
  currentTeamMemberId: string | null;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRefresh: () => void;
  isSending: boolean;
  isRefreshing?: boolean;
};
