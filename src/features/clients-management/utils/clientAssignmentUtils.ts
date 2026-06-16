import { format } from "date-fns";

import type { ClientMemberAssignment } from "@/features/employees-management/types/types";

export function isActiveClientAssignment(
  assignment: ClientMemberAssignment,
): boolean {
  return assignment.ended_at === null;
}

export function splitClientAssignments(assignments: ClientMemberAssignment[]) {
  const active = assignments.filter(isActiveClientAssignment);
  const past = assignments.filter((assignment) => !isActiveClientAssignment(assignment));
  return { active, past };
}

export function formatClientAssignmentDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return format(new Date(value), "MMM d, yyyy");
}

export function formatClientAssignmentPeriod(
  startedAt: string | null,
  endedAt: string | null,
): string {
  const start = formatClientAssignmentDate(startedAt);

  if (!endedAt) {
    return `${start} → not ended yet`;
  }

  return `${start} → ${formatClientAssignmentDate(endedAt)}`;
}

export function getAssignmentMemberName(
  assignment: ClientMemberAssignment,
): string {
  return assignment.team_members?.member_name ?? "Unknown";
}

/** @deprecated Use getAssignmentMemberName */
export const getAssignmentEmployeeName = getAssignmentMemberName;
