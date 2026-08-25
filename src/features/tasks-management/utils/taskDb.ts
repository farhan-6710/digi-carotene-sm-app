import type {
  Task,
  TaskClientRef,
  TaskMemberRef,
  TaskProjectRef,
} from "@/features/tasks-management/types/types";

type Rel<T> = T | T[] | null | undefined;

function pickRelation<T>(value: Rel<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type TaskTagRow = {
  team_member_id: string;
  team_members: Rel<TaskMemberRef>;
};

export type TaskRow = {
  id: string;
  project_id: string;
  client_id: string | null;
  dependency_client_id: string | null;
  title: string;
  description: string | null;
  created_by_team_member_id: string;
  assigned_to_team_member_id: string | null;
  priority: Task["priority"];
  eta_date: string;
  eta_time: string;
  status: Task["status"];
  created_at: string;
  updated_at: string;
  projects: Rel<{
    id: string;
    project_name: string;
    manager_id: string;
    manager: Rel<TaskMemberRef>;
    clients: Rel<{ id: string; client_name: string }>;
  }>;
  client: Rel<TaskClientRef>;
  dependency_client: Rel<TaskClientRef>;
  created_by: Rel<TaskMemberRef>;
  assigned_to: Rel<TaskMemberRef>;
  task_tags: TaskTagRow[] | null;
};

export function mapTaskRow(row: TaskRow): Task {
  const project = pickRelation(row.projects);
  const projectClient = project ? pickRelation(project.clients) : null;
  const manager = project ? pickRelation(project.manager) : null;
  const projects: TaskProjectRef | null = project
    ? {
        id: project.id,
        project_name: project.project_name,
        manager_id: project.manager_id,
        manager: manager ?? (project.manager_id
          ? { id: project.manager_id, member_name: "—" }
          : null),
        clients: projectClient,
      }
    : null;

  const embeddedClient = pickRelation(row.client);
  const client: TaskClientRef | null =
    embeddedClient ??
    (row.client_id && projectClient && projectClient.id === row.client_id
      ? projectClient
      : null) ??
    (row.client_id
      ? {
          id: row.client_id,
          client_name: projectClient?.client_name ?? "—",
        }
      : null);

  const embeddedDependencyClient = pickRelation(row.dependency_client);
  const dependency_client: TaskClientRef | null =
    embeddedDependencyClient ??
    (row.dependency_client_id &&
    projectClient &&
    projectClient.id === row.dependency_client_id
      ? projectClient
      : null) ??
    (row.dependency_client_id
      ? {
          id: row.dependency_client_id,
          client_name: projectClient?.client_name ?? "—",
        }
      : null);

  const tagged_members: TaskMemberRef[] = (row.task_tags ?? [])
    .map((tag) => {
      const member = pickRelation(tag.team_members);
      if (member) return member;
      return { id: tag.team_member_id, member_name: "—" };
    })
    .filter((member) => Boolean(member.id));

  return {
    id: row.id,
    project_id: row.project_id,
    client_id: row.client_id,
    dependency_client_id: row.dependency_client_id,
    title: row.title,
    description: row.description,
    created_by_team_member_id: row.created_by_team_member_id,
    assigned_to_team_member_id: row.assigned_to_team_member_id,
    priority: row.priority,
    eta_date: row.eta_date,
    eta_time: row.eta_time,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    projects,
    client,
    dependency_client,
    created_by: pickRelation(row.created_by),
    assigned_to: pickRelation(row.assigned_to),
    tagged_members,
  };
}
