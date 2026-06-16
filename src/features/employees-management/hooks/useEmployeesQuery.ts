import { useCallback, useEffect, useState } from "react";

import type { TeamMember } from "@/features/employees-management/types/types";
import { fetchTeamMembers } from "@/features/employees-management/utils/employeesRepository";

export function useEmployeesQuery() {
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setEmployees(await fetchTeamMembers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { employees, isLoading, error, setError, reload };
}
