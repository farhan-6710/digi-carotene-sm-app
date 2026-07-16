import { useCallback, useState } from "react";

import {
  assignMemberToProject,
  endProjectTeamAssignment,
} from "@/services/projectTeamMembersService";
import { showToast } from "@/shared/utils/showToast";

type UseTeamMemberProjectActionsOptions = {
  memberId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTeamMemberProjectActions({
  memberId,
  reload,
  setError,
}: UseTeamMemberProjectActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const assignProject = useCallback(
    async (projectIds: string[]) => {
      if (!memberId || isSaving || projectIds.length === 0) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        for (const projectId of projectIds) {
          await assignMemberToProject(memberId, projectId);
        }
        await reload();
        showToast(
          "success",
          projectIds.length > 1
            ? `${projectIds.length} projects assigned successfully.`
            : "Project assigned successfully.",
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to assign project.";
        setError(message);
        showToast("error", message);
        await reload();
      } finally {
        setIsSaving(false);
      }
    },
    [memberId, isSaving, reload, setError],
  );

  const endAssignment = useCallback(
    async (assignmentId: string) => {
      if (isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        await endProjectTeamAssignment(assignmentId);
        await reload();
        showToast("success", "Project assignment ended successfully.");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to end assignment.";
        setError(message);
        showToast("error", message);
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reload, setError],
  );

  return { isSaving, assignProject, endAssignment };
}
