import { format } from "date-fns";

import type {
  ManagedProjectSummary,
  MemberProjectAssignment,
} from "@/features/team-management/types/types";

export function isActiveAssignment(assignment: MemberProjectAssignment): boolean {
  return assignment.ended_at === null;
}

export function splitMemberAssignments(assignments: MemberProjectAssignment[]) {
  const active = assignments.filter(isActiveAssignment);
  const past = assignments.filter((assignment) => !isActiveAssignment(assignment));
  return { active, past };
}

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

export function getAssignmentProjectName(assignment: MemberProjectAssignment): string {
  const projectName = assignment.projects?.project_name ?? "Unknown project";
  const clientName = assignment.projects?.clients?.client_name;

  return clientName ? `${projectName} (${clientName})` : projectName;
}

export function getManagedProjectLabel(project: ManagedProjectSummary): string {
  const clientName = project.clients?.client_name;
  return clientName
    ? `${project.project_name} (${clientName})`
    : project.project_name;
}
