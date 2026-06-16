import type {
  ManagedProjectSummary,
  MemberProjectAssignment,
} from "@/features/team-management/types/types";
import {
  assignMemberToProject,
  endProjectTeamAssignment,
  fetchManagedProjects,
  fetchMemberProjectAssignments,
} from "@/features/projects-management/utils/projectTeamMembersRepository";

export {
  assignMemberToProject,
  endProjectTeamAssignment,
  fetchManagedProjects,
  fetchMemberProjectAssignments,
};

export type { ManagedProjectSummary, MemberProjectAssignment };

export async function fetchMemberAssignments(
  memberId: string,
): Promise<MemberProjectAssignment[]> {
  return fetchMemberProjectAssignments(memberId);
}

export async function assignClientToMember(
  memberId: string,
  projectId: string,
): Promise<MemberProjectAssignment> {
  return assignMemberToProject(memberId, projectId);
}

export async function endMemberAssignment(assignmentId: string): Promise<void> {
  return endProjectTeamAssignment(assignmentId);
}

export async function fetchManagedProjectsForMember(
  memberId: string,
): Promise<ManagedProjectSummary[]> {
  return fetchManagedProjects(memberId);
}
