import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  MemberAssignment,
  TeamMember,
} from "@/features/employees-management/types/types";
import { fetchMemberAssignments } from "@/features/employees-management/utils/employeeAssignmentsRepository";
import { splitMemberAssignments } from "@/features/employees-management/utils/employeeAssignmentUtils";
import { fetchTeamMemberById } from "@/features/employees-management/utils/employeesRepository";

export function useEmployeeDetailQuery(memberId: string) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [assignments, setAssignments] = useState<MemberAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!memberId) {
      setMember(null);
      setAssignments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [memberRow, assignmentRows] = await Promise.all([
        fetchTeamMemberById(memberId),
        fetchMemberAssignments(memberId),
      ]);

      setMember(memberRow);
      setAssignments(assignmentRows);
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
    employee: member,
    assignments,
    activeAssignments,
    pastAssignments,
    isLoading,
    error,
    setError,
    reload,
  };
}
