import type {
  Subtask,
  TaskAssigneeRef,
  TaskClientRef,
  TaskMemberRef,
} from "@/features/tasks-management/types/types";

type Rel<T> = T | T[] | null | undefined;

function pickRelation<T>(value: Rel<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type SubtaskAssigneeRow = {
  team_member_id: string | null;
  client_id: string | null;
  team_members: Rel<TaskMemberRef>;
  clients: Rel<TaskClientRef>;
};

export type SubtaskRow = {
  id: string;
  parent_task_id: string;
  title: string;
  description: string;
  created_by_team_member_id: string | null;
  created_by_client_id: string | null;
  assigned_to_team_member_id: string | null;
  assigned_to_client_id: string | null;
  priority: Subtask["priority"];
  eta_date: string;
  eta_time: string;
  status: Subtask["status"];
  created_at: string;
  updated_at: string;
  created_by: Rel<TaskMemberRef>;
  created_by_client: Rel<TaskClientRef>;
  assigned_to: Rel<TaskMemberRef>;
  assigned_to_client: Rel<TaskClientRef>;
  subtask_assignees: SubtaskAssigneeRow[] | null;
};

function mapAssigneeRows(rows: SubtaskAssigneeRow[] | null): TaskAssigneeRef[] {
  return (rows ?? [])
    .map((row) => {
      const team_member = pickRelation(row.team_members);
      const client = pickRelation(row.clients);
      return {
        team_member_id: row.team_member_id,
        client_id: row.client_id,
        team_member:
          team_member ??
          (row.team_member_id
            ? { id: row.team_member_id, member_name: "—" }
            : null),
        client:
          client ??
          (row.client_id
            ? { id: row.client_id, client_name: "—" }
            : null),
      };
    })
    .filter((row) => Boolean(row.team_member_id || row.client_id));
}

export function mapSubtaskRow(row: SubtaskRow): Subtask {
  let assignees = mapAssigneeRows(row.subtask_assignees);
  if (assignees.length === 0) {
    if (row.assigned_to_team_member_id) {
      assignees = [
        {
          team_member_id: row.assigned_to_team_member_id,
          client_id: null,
          team_member:
            pickRelation(row.assigned_to) ?? {
              id: row.assigned_to_team_member_id,
              member_name: "—",
            },
          client: null,
        },
      ];
    } else if (row.assigned_to_client_id) {
      assignees = [
        {
          team_member_id: null,
          client_id: row.assigned_to_client_id,
          team_member: null,
          client:
            pickRelation(row.assigned_to_client) ?? {
              id: row.assigned_to_client_id,
              client_name: "—",
            },
        },
      ];
    }
  }

  return {
    id: row.id,
    parent_task_id: row.parent_task_id,
    title: row.title,
    description: row.description,
    created_by_team_member_id: row.created_by_team_member_id,
    created_by_client_id: row.created_by_client_id,
    assigned_to_team_member_id: row.assigned_to_team_member_id,
    assigned_to_client_id: row.assigned_to_client_id,
    priority: row.priority,
    eta_date: row.eta_date,
    eta_time: row.eta_time,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: pickRelation(row.created_by),
    created_by_client: pickRelation(row.created_by_client),
    assigned_to: pickRelation(row.assigned_to),
    assigned_to_client: pickRelation(row.assigned_to_client),
    assignees,
  };
}
