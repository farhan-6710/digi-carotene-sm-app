import { useCallback, useState } from "react";

import {
  assignClientToMember,
  endMemberAssignment,
} from "@/features/employees-management/utils/employeeAssignmentsRepository";

type UseEmployeeClientActionsOptions = {
  memberId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useEmployeeClientActions({
  memberId,
  reload,
  setError,
}: UseEmployeeClientActionsOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const assignClient = useCallback(
    async (clientId: string) => {
      if (!memberId || isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        await assignClientToMember(memberId, clientId);
        await reload();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to assign client.",
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

  return { isSaving, assignClient, endAssignment };
}
