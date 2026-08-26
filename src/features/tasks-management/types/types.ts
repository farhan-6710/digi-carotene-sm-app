export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskMemberRef = {
  id: string;
  member_name: string;
};

export type TaskProjectRef = {
  id: string;
  project_name: string;
  manager_id: string;
  manager: TaskMemberRef | null;
  clients: { id: string; client_name: string } | null;
};

export type TaskClientRef = {
  id: string;
  client_name: string;
};

export type TaskAssigneeRef = {
  team_member_id: string | null;
  client_id: string | null;
  team_member: TaskMemberRef | null;
  client: TaskClientRef | null;
};

export type Task = {
  id: string;
  /** SM project id when set; mutually exclusive with `dev_project_id`. */
  project_id: string | null;
  /** Dev project id when set; mutually exclusive with `project_id`. */
  dev_project_id: string | null;
  client_id: string | null;
  dependency_client_id: string | null;
  title: string;
  description: string | null;
  created_by_team_member_id: string;
  assigned_to_team_member_id: string | null;
  priority: TaskPriority;
  eta_date: string;
  eta_time: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  /** Resolved SM or Dev project for display. */
  projects: TaskProjectRef | null;
  client: TaskClientRef | null;
  dependency_client: TaskClientRef | null;
  created_by: TaskMemberRef | null;
  assigned_to: TaskMemberRef | null;
  tagged_members: TaskMemberRef[];
  assignees: TaskAssigneeRef[];
};

export type TaskMessage = {
  id: string;
  task_id: string;
  author_team_member_id: string | null;
  author_client_id: string | null;
  body: string;
  created_at: string;
  author: TaskMemberRef | null;
  author_client: TaskClientRef | null;
};

export type CreateTaskInput = {
  /** SM project id (XOR with `devProjectId`). */
  projectId?: string | null;
  /** Dev project id (XOR with `projectId`). */
  devProjectId?: string | null;
  title: string;
  description?: string | null;
  assigneeTeamMemberIds?: string[];
  assigneeClientIds?: string[];
  priority: TaskPriority;
  etaDate: string;
  etaTime: string;
  taggedTeamMemberIds?: string[];
  dependencyClientId?: string | null;
};

export type UpdateTaskInput = {
  projectId?: string | null;
  devProjectId?: string | null;
  title?: string;
  description?: string | null;
  assigneeTeamMemberIds?: string[];
  assigneeClientIds?: string[];
  priority?: TaskPriority;
  etaDate?: string;
  etaTime?: string;
  status?: TaskStatus;
  taggedTeamMemberIds?: string[];
  dependencyClientId?: string | null;
};

export type Subtask = {
  id: string;
  parent_task_id: string;
  title: string;
  description: string;
  created_by_team_member_id: string | null;
  created_by_client_id: string | null;
  assigned_to_team_member_id: string | null;
  assigned_to_client_id: string | null;
  priority: TaskPriority;
  eta_date: string;
  eta_time: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  created_by: TaskMemberRef | null;
  created_by_client: TaskClientRef | null;
  assigned_to: TaskMemberRef | null;
  assigned_to_client: TaskClientRef | null;
  assignees: TaskAssigneeRef[];
};

export type CreateSubtaskInput = {
  parentTaskId: string;
  title: string;
  description: string;
  assigneeTeamMemberIds?: string[];
  assigneeClientIds?: string[];
  priority: TaskPriority;
  etaDate: string;
  etaTime: string;
};

export type UpdateSubtaskInput = {
  title?: string;
  description?: string;
  assigneeTeamMemberIds?: string[];
  assigneeClientIds?: string[];
  priority?: TaskPriority;
  etaDate?: string;
  etaTime?: string;
  status?: TaskStatus;
};
