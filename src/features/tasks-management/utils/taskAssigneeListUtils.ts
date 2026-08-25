import {
  encodeTaskAssignee,
  parseTaskAssignee,
} from "@/features/tasks-management/utils/taskAssigneeUtils";
import type { Task, Subtask } from "@/features/tasks-management/types/types";

export function parseAssigneeKeys(keys: string[]): {
  teamMemberIds: string[];
  clientIds: string[];
} {
  const teamMemberIds: string[] = [];
  const clientIds: string[] = [];

  for (const key of keys) {
    const parsed = parseTaskAssignee(key);
    if (!parsed) continue;
    if (parsed.kind === "team") {
      teamMemberIds.push(parsed.id);
    } else {
      clientIds.push(parsed.id);
    }
  }

  return {
    teamMemberIds: [...new Set(teamMemberIds)],
    clientIds: [...new Set(clientIds)],
  };
}

export function assigneeKeysFromTask(task: Task): string[] {
  if (task.assignees.length > 0) {
    return task.assignees.map((row) =>
      row.team_member_id
        ? encodeTaskAssignee("team", row.team_member_id)
        : encodeTaskAssignee("client", row.client_id!),
    );
  }

  // Fallback while rows still only live on legacy columns.
  const keys: string[] = [];
  if (task.assigned_to_team_member_id) {
    keys.push(encodeTaskAssignee("team", task.assigned_to_team_member_id));
  }
  if (task.client_id) {
    keys.push(encodeTaskAssignee("client", task.client_id));
  }
  return keys;
}

export function assigneeKeysFromSubtask(subtask: Subtask): string[] {
  if (subtask.assignees.length > 0) {
    return subtask.assignees.map((row) =>
      row.team_member_id
        ? encodeTaskAssignee("team", row.team_member_id)
        : encodeTaskAssignee("client", row.client_id!),
    );
  }

  const keys: string[] = [];
  if (subtask.assigned_to_team_member_id) {
    keys.push(encodeTaskAssignee("team", subtask.assigned_to_team_member_id));
  }
  if (subtask.assigned_to_client_id) {
    keys.push(encodeTaskAssignee("client", subtask.assigned_to_client_id));
  }
  return keys;
}

export function formatAssigneeLabels(input: {
  members: { member_name: string }[];
  clients: { client_name: string }[];
}): string {
  const parts = [
    ...input.members.map((member) => member.member_name),
    ...input.clients.map((client) => client.client_name),
  ];
  return parts.length > 0 ? parts.join(", ") : "—";
}
