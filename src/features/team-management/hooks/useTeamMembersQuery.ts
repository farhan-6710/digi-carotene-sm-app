import { useCallback, useEffect, useState } from "react";

import type { TeamMember } from "@/features/team-management/types/types";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";

export function useTeamMembersQuery() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamMembers();
      setMembers(data);
    } catch (err) {
      setMembers([]);
      setError(err instanceof Error ? err.message : "Failed to load team members.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { members, isLoading, error, setError, reload };
}
