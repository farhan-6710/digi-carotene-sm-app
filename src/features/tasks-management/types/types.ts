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

export type Task = {
  id: string;
  project_id: string;
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
  projects: TaskProjectRef | null;
  client: TaskClientRef | null;
  dependency_client: TaskClientRef | null;
  created_by: TaskMemberRef | null;
  assigned_to: TaskMemberRef | null;
  tagged_members: TaskMemberRef[];
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
  projectId: string;
  clientId?: string | null;
  title: string;
  description?: string | null;
  assignedToTeamMemberId?: string | null;
  priority: TaskPriority;
  etaDate: string;
  etaTime: string;
  taggedTeamMemberIds?: string[];
  dependencyClientId?: string | null;
};

export type UpdateTaskInput = {
  projectId?: string;
  clientId?: string | null;
  title?: string;
  description?: string | null;
  assignedToTeamMemberId?: string | null;
  priority?: TaskPriority;
  etaDate?: string;
  etaTime?: string;
  status?: TaskStatus;
  taggedTeamMemberIds?: string[];
  dependencyClientId?: string | null;
};
