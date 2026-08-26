import type { TaskTabId } from "@/features/tasks-management/constants/taskTabs";
import type {
  Subtask,
  Task,
  TaskMessage,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks-management/types/types";
import type { TaskChatParticipant } from "@/features/tasks-management/utils/taskChatMentionUtils";
import type { SubtaskFormValues } from "@/features/tasks-management/utils/subtaskFormUtils";
import type { TaskFormValues } from "@/features/tasks-management/utils/taskFormUtils";

export type TasksTableProps = {
  tasks: Task[];
  isLoading: boolean;
  canEditTask: (task: Task) => boolean;
  onEditTask: (task: Task) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  /** `yyyy-MM-dd` or empty — filters rows by task ETA date. */
  etaDate: string;
  onEtaDateChange: (value: string) => void;
  tab: TaskTabId;
  onTabChange: (tab: TaskTabId) => void;
};

export type TasksTableRowProps = {
  task: Task;
  canEdit: boolean;
  onEdit: (task: Task) => void;
  /** Override detail link (client portal uses a different path). */
  detailPath?: string;
};

export type SubtasksTableProps = {
  subtasks: Subtask[];
  isLoading: boolean;
  canEditSubtask: (subtask: Subtask) => boolean;
  onEditSubtask: (subtask: Subtask) => void;
  canAdd: boolean;
  onAddSubtask: () => void;
  buildDetailPath?: (subtaskId: string) => string;
};

export type SubtasksTableRowProps = {
  subtask: Subtask;
  canEdit: boolean;
  onEdit: (subtask: Subtask) => void;
  detailPath?: string;
};

export type SubtaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  /** Assignee updating progress — status field only. */
  statusOnly?: boolean;
  isSaving?: boolean;
  values: SubtaskFormValues;
  allowedMemberIds: string[];
  allowedClientIds: string[];
  currentTeamMemberId?: string | null;
  currentClientId?: string | null;
  onFieldChange: <K extends keyof SubtaskFormValues>(
    field: K,
    value: SubtaskFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type TaskChatProps = {
  messages: TaskMessage[];
  currentTeamMemberId: string | null;
  /** When the viewer is a client portal user. */
  currentClientId?: string | null;
  /** Raiser, assignee, dependencies, client, PM, admins (for @mentions). */
  chatParticipants: TaskChatParticipant[];
  /** Parent-task subtasks for `/` mentions. */
  subtasks?: Array<{ id: string; title: string }>;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRefresh: () => void;
  isSending: boolean;
  isRefreshing?: boolean;
  editingMessageId?: string | null;
  onEditMessage?: (message: TaskMessage) => void;
  onCancelEdit?: () => void;
  onDeleteMessage?: (messageId: string) => void;
  deleteConfirmOpen?: boolean;
  onDeleteConfirmOpenChange?: (open: boolean) => void;
  onConfirmDelete?: () => void | Promise<void>;
  isDeleting?: boolean;
};

export type TaskChatMessageProps = {
  message: TaskMessage;
  isMine: boolean;
  isEditing: boolean;
  participantNames: string[];
  subtaskTitles: string[];
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export type TaskAssigneePickerProps = {
  value: string;
  onChange: (encodedValue: string) => void;
  /** Project/task roster. Null when none selected. */
  allowedMemberIds: string[] | null;
  /** Single client (project). Prefer `allowedClientIds` when several. */
  allowedClientId?: string | null;
  /** Extra client ids (e.g. parent-task assignee + dependency). */
  allowedClientIds?: string[];
  disabled?: boolean;
  preload?: boolean;
};

export type TaskAssigneesSelectProps = {
  value: string[];
  onChange: (keys: string[]) => void;
  allowedMemberIds: string[] | null;
  allowedClientId?: string | null;
  allowedClientIds?: string[];
  excludeKeys?: string[];
  disabled?: boolean;
  preload?: boolean;
};

export type TaskDependenciesSelectProps = {
  /** Encoded keys: `team:<id>` and/or `client:<id>`. */
  value: string[];
  onChange: (keys: string[]) => void;
  /** Project roster. Null when no project is selected. */
  allowedMemberIds: string[] | null;
  allowedClientId: string | null;
  /** Encoded assignee key to hide from the list. */
  excludeKeys?: string[];
  disabled?: boolean;
  preload?: boolean;
};

export type TaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: TaskFormValues;
  currentTeamMemberId?: string | null;
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

export type SubtaskDetailSummaryProps = {
  subtask: Subtask;
  parentTaskTitle?: string;
};

export type SubtasksSectionProps = {
  parentTask: Task;
  buildDetailPath?: (subtaskId: string) => string;
};
