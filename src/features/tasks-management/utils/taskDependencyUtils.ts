import {
  encodeTaskAssignee,
  parseTaskAssignee,
} from "@/features/tasks-management/utils/taskAssigneeUtils";
import type { Task } from "@/features/tasks-management/types/types";

export function dependencyKeysFromTask(task: Task): string[] {
  const keys = task.tagged_members.map((member) =>
    encodeTaskAssignee("team", member.id),
  );
  if (task.dependency_client_id) {
    keys.push(encodeTaskAssignee("client", task.dependency_client_id));
  }
  return keys;
}

export function parseDependencyKeys(keys: string[]): {
  taggedTeamMemberIds: string[];
  dependencyClientId: string | null;
} {
  const taggedTeamMemberIds: string[] = [];
  let dependencyClientId: string | null = null;

  for (const key of keys) {
    const parsed = parseTaskAssignee(key);
    if (!parsed) continue;
    if (parsed.kind === "team") {
      taggedTeamMemberIds.push(parsed.id);
    } else {
      dependencyClientId = parsed.id;
    }
  }

  return {
    taggedTeamMemberIds: [...new Set(taggedTeamMemberIds)],
    dependencyClientId,
  };
}
