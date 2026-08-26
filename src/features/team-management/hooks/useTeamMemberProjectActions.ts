import { useCallback, useState } from "react";

import {
  parseProjectKey,
} from "@/features/projects-management/utils/projectKindUtils";
import {
  assignMemberToDevProject,
  endDevProjectTeamAssignment,
} from "@/services/devProjectTeamMembersService";
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
    async (projectKeys: string[]) => {
      if (!memberId || isSaving || projectKeys.length === 0) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        for (const key of projectKeys) {
          const parsed = parseProjectKey(key);
          if (!parsed) {
            throw new Error("Invalid project selection.");
          }
          if (parsed.kind === "sm") {
            await assignMemberToProject(memberId, parsed.id);
          } else {
            await assignMemberToDevProject(memberId, parsed.id);
          }
        }
        await reload();
        showToast(
          "success",
          projectKeys.length > 1
            ? `${projectKeys.length} projects assigned successfully.`
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
    async (assignmentKey: string) => {
      if (isSaving) {
        return;
      }

      const parsed = parseProjectKey(assignmentKey);
      if (!parsed) {
        setError("Invalid assignment.");
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        if (parsed.kind === "sm") {
          await endProjectTeamAssignment(parsed.id);
        } else {
          await endDevProjectTeamAssignment(parsed.id);
        }
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
