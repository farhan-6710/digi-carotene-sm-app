import { useCallback, useState } from "react";

import {
  assignMemberToProject,
  endMemberAssignment,
} from "@/features/team-management/utils/teamMemberAssignmentsRepository";

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
    async (projectId: string) => {
      if (!memberId || isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        await assignMemberToProject(memberId, projectId);
        await reload();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to assign project.",
        );
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
        await endMemberAssignment(assignmentId);
        await reload();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to end assignment.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reload, setError],
  );

  return { isSaving, assignProject, endAssignment };
}
