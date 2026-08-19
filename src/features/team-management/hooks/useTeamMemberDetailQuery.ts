import { useCallback, useMemo } from "react";

import type {
  ManagedProjectSummary,
  MemberPlanAssignment,
  MemberPlanRoleAssignment,
  MemberProjectAssignment,
  TeamMember,
} from "@/features/team-management/types/types";
import {
  splitMemberAssignments,
  splitMemberPlanAssignments,
} from "@/features/team-management/utils/teamMemberAssignmentUtils";
import {
  fetchManagedProjects,
  fetchMemberProjectAssignments,
} from "@/services/projectTeamMembersService";
import {
  fetchMemberPlanAssignments,
  fetchMemberPlanRoleAssignments,
} from "@/services/productionPlanTeamMembersService";
import { fetchTeamMemberById } from "@/services/teamMembersService";
import { useFetch } from "@/shared/hooks/useFetch";

type MemberDetail = {
  member: TeamMember | null;
  assignments: MemberProjectAssignment[];
  managedProjects: ManagedProjectSummary[];
  planAssignments: MemberPlanAssignment[];
  roleAssignedPlans: MemberPlanRoleAssignment[];
};

const EMPTY: MemberDetail = {
  member: null,
  assignments: [],
  managedProjects: [],
  planAssignments: [],
  roleAssignedPlans: [],
};

export function useTeamMemberDetailQuery(memberId: string) {
  const load = useCallback(async (): Promise<MemberDetail> => {
    if (!memberId) {
      return EMPTY;
    }

    const [
      member,
      assignments,
      managedProjects,
      planAssignments,
      roleAssignedPlans,
    ] = await Promise.all([
      fetchTeamMemberById(memberId),
      fetchMemberProjectAssignments(memberId),
      fetchManagedProjects(memberId),
      fetchMemberPlanAssignments(memberId),
      fetchMemberPlanRoleAssignments(memberId),
    ]);

    return {
      member,
      assignments,
      managedProjects,
      planAssignments,
      roleAssignedPlans,
    };
  }, [memberId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  const { active: activeAssignments, past: pastAssignments } = useMemo(
    () => splitMemberAssignments(data.assignments),
    [data.assignments],
  );

  const { active: activePlanAssignments } = useMemo(
    () => splitMemberPlanAssignments(data.planAssignments),
    [data.planAssignments],
  );

  return {
    member: data.member,
    assignments: data.assignments,
    activeAssignments,
    pastAssignments,
    managedProjects: data.managedProjects,
    planAssignments: data.planAssignments,
    activePlanAssignments,
    roleAssignedPlans: data.roleAssignedPlans,
    isLoading,
    error,
    setError,
    reload,
  };
}
