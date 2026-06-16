import { format } from "date-fns";

import type { MemberAssignment } from "@/features/employees-management/types/types";

export function isActiveAssignment(assignment: MemberAssignment): boolean {
  return assignment.ended_at === null;
}

export function splitMemberAssignments(assignments: MemberAssignment[]) {
  const active = assignments.filter(isActiveAssignment);
  const past = assignments.filter((assignment) => !isActiveAssignment(assignment));
  return { active, past };
}

/** @deprecated Use splitMemberAssignments */
export const splitEmployeeAssignments = splitMemberAssignments;

export function formatAssignmentDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return format(new Date(value), "MMM d, yyyy");
}

export function formatAssignmentPeriod(
  startedAt: string | null,
  endedAt: string | null,
): string {
  const start = formatAssignmentDate(startedAt);

  if (!endedAt) {
    return `${start} → not ended yet`;
  }

  return `${start} → ${formatAssignmentDate(endedAt)}`;
}

export function getAssignmentClientName(assignment: MemberAssignment): string {
  return assignment.clients?.client_name ?? "Unknown client";
}
