export type TaskPriority = "normal" | "high";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskMemberRef = {
  id: string;
  member_name: string;
};

export type TaskProjectRef = {
  id: string;
  project_name: string;
  manager_id: string;
  clients: { id: string; client_name: string } | null;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_by_team_member_id: string;
  assigned_to_team_member_id: string;
  priority: TaskPriority;
  eta_date: string;
  eta_time: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  projects: TaskProjectRef | null;
  created_by: TaskMemberRef | null;
  assigned_to: TaskMemberRef | null;
  tagged_members: TaskMemberRef[];
};

export type TaskMessage = {
  id: string;
  task_id: string;
  author_team_member_id: string;
  body: string;
  created_at: string;
  author: TaskMemberRef | null;
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string | null;
  assignedToTeamMemberId: string;
  priority: TaskPriority;
  etaDate: string;
  etaTime: string;
  taggedTeamMemberIds?: string[];
};

export type UpdateTaskInput = {
  projectId?: string;
  title?: string;
  description?: string | null;
  assignedToTeamMemberId?: string;
  priority?: TaskPriority;
  etaDate?: string;
  etaTime?: string;
  status?: TaskStatus;
  taggedTeamMemberIds?: string[];
};
