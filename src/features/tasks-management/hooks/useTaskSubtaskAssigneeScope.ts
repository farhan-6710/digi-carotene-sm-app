import { useEffect, useState } from "react";

import type { Task } from "@/features/tasks-management/types/types";
import { getSubtaskAssigneeScopeFromProject } from "@/features/tasks-management/utils/subtaskPeopleUtils";
import {
  toTaskProjectPeopleSource,
  type TaskProjectPeopleSource,
} from "@/features/tasks-management/utils/taskProjectPeopleUtils";
import { fetchDevProjectById } from "@/services/devProjectsService";
import { fetchProjectById } from "@/services/projectsService";

/**
 * Loads the parent task's SM/Dev project and returns the same assignee
 * scope used when assigning a task (teammates + client).
 */
export function useTaskSubtaskAssigneeScope(parentTask: Task | null) {
  const [project, setProject] = useState<TaskProjectPeopleSource | null>(null);

  useEffect(() => {
    if (!parentTask) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProject(null);
      return;
    }

    const smId = parentTask.project_id;
    const devId = parentTask.dev_project_id;
    let cancelled = false;

    void (async () => {
      try {
        if (smId) {
          const row = await fetchProjectById(smId);
          if (!cancelled) {
            setProject(row ? toTaskProjectPeopleSource(row) : null);
          }
          return;
        }
        if (devId) {
          const row = await fetchDevProjectById(devId);
          if (!cancelled) {
            setProject(row ? toTaskProjectPeopleSource(row) : null);
          }
          return;
        }
        if (!cancelled) setProject(null);
      } catch {
        if (!cancelled) setProject(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [parentTask]);

  const scope = getSubtaskAssigneeScopeFromProject(project);

  return {
    allowedMemberIds: scope.memberIds,
    allowedClientIds: scope.clientIds,
  };
}
