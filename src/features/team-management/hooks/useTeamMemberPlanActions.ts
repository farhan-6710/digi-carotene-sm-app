import { useCallback, useState } from "react";

import {
  assignMemberToProductionPlan,
  endProductionPlanAssignment,
} from "@/services/productionPlanTeamMembersService";
import { showToast } from "@/shared/utils/showToast";

type UseTeamMemberPlanActionsOptions = {
  memberId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTeamMemberPlanActions({
  memberId,
  reload,
  setError,
}: UseTeamMemberPlanActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const assignPlan = useCallback(
    async (planIds: string[]) => {
      if (!memberId || isSaving || planIds.length === 0) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        for (const planId of planIds) {
          await assignMemberToProductionPlan(memberId, planId);
        }
        await reload();
        showToast(
          "success",
          planIds.length > 1
            ? `${planIds.length} plans assigned successfully.`
            : "Plan assigned successfully.",
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to assign plan.";
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
        await endProductionPlanAssignment(assignmentId);
        await reload();
        showToast("success", "Plan assignment ended successfully.");
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

  return { isSaving, assignPlan, endAssignment };
}
