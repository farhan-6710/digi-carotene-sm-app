import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  ManagedProjectSummary,
  MemberProjectAssignment,
  TeamMember,
} from "@/features/team-management/types/types";
import {
  fetchManagedProjectsForMember,
  fetchMemberAssignments,
} from "@/features/team-management/utils/teamMemberAssignmentsRepository";
import { splitMemberAssignments } from "@/features/team-management/utils/teamMemberAssignmentUtils";
import { fetchTeamMemberById } from "@/features/team-management/utils/teamMembersRepository";

export function useTeamMemberDetailQuery(memberId: string) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [assignments, setAssignments] = useState<MemberProjectAssignment[]>([]);
  const [managedProjects, setManagedProjects] = useState<ManagedProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!memberId) {
      setMember(null);
      setAssignments([]);
      setManagedProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [memberRow, assignmentRows, managedRows] = await Promise.all([
        fetchTeamMemberById(memberId),
        fetchMemberAssignments(memberId),
        fetchManagedProjectsForMember(memberId),
      ]);

      setMember(memberRow);
      setAssignments(assignmentRows);
      setManagedProjects(managedRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team member.");
    } finally {
      setIsLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const { active: activeAssignments, past: pastAssignments } = useMemo(
    () => splitMemberAssignments(assignments),
    [assignments],
  );

  return {
    member,
    assignments,
    activeAssignments,
    pastAssignments,
    managedProjects,
    isLoading,
    error,
    setError,
    reload,
  };
}
