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
  fetchManagedDevProjects,
  fetchMemberDevProjectAssignments,
} from "@/services/devProjectTeamMembersService";
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

function withKind(
  assignment: Omit<MemberProjectAssignment, "project_kind">,
  project_kind: MemberProjectAssignment["project_kind"],
): MemberProjectAssignment {
  return { ...assignment, project_kind };
}

function withManagedKind(
  project: Omit<ManagedProjectSummary, "project_kind">,
  project_kind: ManagedProjectSummary["project_kind"],
): ManagedProjectSummary {
  return { ...project, project_kind };
}

export function useTeamMemberDetailQuery(memberId: string) {
  const load = useCallback(async (): Promise<MemberDetail> => {
    if (!memberId) {
      return EMPTY;
    }

    const [
      member,
      smAssignments,
      smManaged,
      devAssignments,
      devManaged,
      planAssignments,
      roleAssignedPlans,
    ] = await Promise.all([
      fetchTeamMemberById(memberId),
      fetchMemberProjectAssignments(memberId),
      fetchManagedProjects(memberId),
      fetchMemberDevProjectAssignments(memberId),
      fetchManagedDevProjects(memberId),
      fetchMemberPlanAssignments(memberId),
      fetchMemberPlanRoleAssignments(memberId),
    ]);

    const assignments = [
      ...smAssignments.map((row) => withKind(row, "sm")),
      ...devAssignments.map((row) => withKind(row, "dev")),
    ].sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    );

    const managedProjects = [
      ...smManaged.map((row) => withManagedKind(row, "sm")),
      ...devManaged.map((row) => withManagedKind(row, "dev")),
    ].sort((a, b) => a.project_name.localeCompare(b.project_name));

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
