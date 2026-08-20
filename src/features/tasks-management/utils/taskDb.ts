import type {
  Task,
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
  title: string;
  description: string | null;
  created_by_team_member_id: string;
  assigned_to_team_member_id: string;
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
    clients: Rel<{ id: string; client_name: string }>;
  }>;
  created_by: Rel<TaskMemberRef>;
  assigned_to: Rel<TaskMemberRef>;
  task_tags: TaskTagRow[] | null;
};

export function mapTaskRow(row: TaskRow): Task {
  const project = pickRelation(row.projects);
  const client = project ? pickRelation(project.clients) : null;
  const projects: TaskProjectRef | null = project
    ? {
        id: project.id,
        project_name: project.project_name,
        manager_id: project.manager_id,
        clients: client,
      }
    : null;

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
    created_by: pickRelation(row.created_by),
    assigned_to: pickRelation(row.assigned_to),
    tagged_members,
  };
}
