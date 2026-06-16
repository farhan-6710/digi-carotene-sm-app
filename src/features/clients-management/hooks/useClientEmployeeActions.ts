import { useCallback, useState } from "react";

import {
  assignClientToMember,
  endMemberAssignment,
} from "@/features/employees-management/utils/employeeAssignmentsRepository";

type UseClientEmployeeActionsOptions = {
  clientId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useClientEmployeeActions({
  clientId,
  reload,
  setError,
}: UseClientEmployeeActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const assignMember = useCallback(
    async (memberId: string) => {
      if (!clientId || isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        await assignClientToMember(memberId, clientId);
        await reload();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to assign team member.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [clientId, isSaving, reload, setError],
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

  return { isSaving, assignMember, endAssignment };
}
