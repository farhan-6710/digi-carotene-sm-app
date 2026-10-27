import { useCallback, useState } from "react";

import type {
  CreateLeadFollowUpInput,
  LeadFollowUpStatus,
  UpdateLeadFollowUpInput,
} from "@/features/crm/types/types";
import {
  createLeadFollowUp,
  deleteLeadFollowUp,
  updateLeadFollowUp,
} from "@/services/leadFollowUpsService";
import { showToast } from "@/shared/utils/showToast";

type UseLeadFollowUpActionsOptions = {
  leadId?: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useLeadFollowUpActions({
  leadId = "",
  reload,
  setError,
}: UseLeadFollowUpActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const run = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
      failureFallback: string,
    ) => {
      if (isSaving) return;
      setIsSaving(true);
      setError(null);
      try {
        await action();
        showToast("success", successMessage);
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : failureFallback;
        setError(message);
        showToast("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reload, setError],
  );

  const saveFollowUp = useCallback(
    async (followUpId: string | null, input: CreateLeadFollowUpInput) => {
      await run(
        () =>
          followUpId
            ? updateLeadFollowUp(followUpId, input)
            : createLeadFollowUp(leadId, input),
        followUpId ? "Follow-up updated." : "Follow-up created.",
        followUpId
          ? "Failed to update follow-up."
          : "Failed to create follow-up.",
      );
    },
    [leadId, run],
  );

  const removeFollowUp = useCallback(
    async (followUpId: string) => {
      await run(
        () => deleteLeadFollowUp(followUpId),
        "Follow-up deleted.",
        "Failed to delete follow-up.",
      );
    },
    [run],
  );

  const updateStatus = useCallback(
    async (followUpId: string, status: LeadFollowUpStatus) => {
      await run(
        () => updateLeadFollowUp(followUpId, { status }),
        "Follow-up updated.",
        "Failed to update follow-up.",
      );
    },
    [run],
  );

  const reschedule = useCallback(
    async (followUpId: string, input: UpdateLeadFollowUpInput) => {
      await run(
        () => updateLeadFollowUp(followUpId, input),
        "Follow-up rescheduled.",
        "Failed to reschedule follow-up.",
      );
    },
    [run],
  );

  return {
    isSaving,
    saveFollowUp,
    removeFollowUp,
    updateStatus,
    reschedule,
  };
}
