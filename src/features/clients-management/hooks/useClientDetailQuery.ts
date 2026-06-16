import { useCallback, useEffect, useMemo, useState } from "react";

import type { Client } from "@/features/clients-management/types/types";
import { fetchClientById } from "@/features/clients-management/utils/clientsRepository";
import { splitClientAssignments } from "@/features/clients-management/utils/clientAssignmentUtils";
import type { ClientMemberAssignment } from "@/features/employees-management/types/types";
import { fetchClientAssignments } from "@/features/employees-management/utils/employeeAssignmentsRepository";

export function useClientDetailQuery(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [assignments, setAssignments] = useState<ClientMemberAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setAssignments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [clientRow, assignmentRows] = await Promise.all([
        fetchClientById(clientId),
        fetchClientAssignments(clientId),
      ]);

      setClient(clientRow);
      setAssignments(assignmentRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  const { active, past } = useMemo(
    () => splitClientAssignments(assignments),
    [assignments],
  );

  return {
    client,
    assignments,
    activeAssignments: active,
    pastAssignments: past,
    isLoading,
    error,
    setError,
    reload,
  };
}
