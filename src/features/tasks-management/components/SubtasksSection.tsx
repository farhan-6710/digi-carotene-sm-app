import { useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { SubtaskDialog } from "@/features/tasks-management/components/SubtaskDialog";
import { SubtasksTable } from "@/features/tasks-management/components/SubtasksTable";
import { useSubtaskDialog } from "@/features/tasks-management/hooks/useSubtaskDialog";
import { useSubtasksQuery } from "@/features/tasks-management/hooks/useSubtasksQuery";
import type { SubtasksSectionProps } from "@/features/tasks-management/types/components";
import {
  canCreateSubtaskAccess,
  canEditSubtaskAccess,
} from "@/features/tasks-management/utils/taskAccessUtils";
import {
  getTaskSubtaskAssigneeClientIds,
  getTaskSubtaskAssigneeMemberIds,
} from "@/features/tasks-management/utils/subtaskPeopleUtils";
import { ErrorBanner } from "@/shared/components/ErrorBanner";

export function SubtasksSection({
  parentTask,
  buildDetailPath,
}: SubtasksSectionProps) {
  const { teamRole, teamMemberId, clientId } = useAuth();
  const { subtasks, isLoading, error, setError, reload } = useSubtasksQuery(
    parentTask.id,
  );
  const { openAddDialog, openEditDialog, dialog } = useSubtaskDialog({
    parentTask,
    parentTaskId: parentTask.id,
    reload,
    setError,
  });

  const allowedMemberIds = useMemo(
    () => getTaskSubtaskAssigneeMemberIds(parentTask),
    [parentTask],
  );
  const allowedClientIds = useMemo(
    () => getTaskSubtaskAssigneeClientIds(parentTask),
    [parentTask],
  );

  const canAdd = canCreateSubtaskAccess({
    task: parentTask,
    teamRole,
    teamMemberId,
    clientId,
  });

  return (
    <div className="space-y-3">
      {error ? <ErrorBanner message={error} /> : null}
      <SubtasksTable
        subtasks={subtasks}
        isLoading={isLoading}
        canAdd={canAdd}
        onAddSubtask={openAddDialog}
        canEditSubtask={(subtask) =>
          canEditSubtaskAccess({
            subtask,
            parentTask,
            teamRole,
            teamMemberId,
            clientId,
          })
        }
        onEditSubtask={openEditDialog}
        buildDetailPath={buildDetailPath}
      />
      {canAdd ? (
        <SubtaskDialog
          {...dialog}
          allowedMemberIds={allowedMemberIds}
          allowedClientIds={allowedClientIds}
        />
      ) : null}
    </div>
  );
}
