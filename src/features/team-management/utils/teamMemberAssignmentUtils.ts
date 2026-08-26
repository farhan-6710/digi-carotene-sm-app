import { format } from "date-fns";

import { projectKindLabel } from "@/features/projects-management/utils/projectKindUtils";
import type {
  ManagedProjectSummary,
  MemberPlanAssignment,
  MemberPlanRoleAssignment,
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

export function getAssignmentKindMeta(
  assignment: MemberProjectAssignment,
): string {
  return projectKindLabel(assignment.project_kind);
}

export function getManagedProjectKindMeta(
  project: ManagedProjectSummary,
): string {
  return `${projectKindLabel(project.project_kind)} · Project manager`;
}

export function splitMemberPlanAssignments(assignments: MemberPlanAssignment[]) {
  const active = assignments.filter((assignment) => assignment.ended_at === null);
  const past = assignments.filter((assignment) => assignment.ended_at !== null);
  return { active, past };
}

export function getAssignmentPlanName(assignment: MemberPlanAssignment): string {
  const planName = assignment.production_plans?.plan_name ?? "Unknown plan";
  const clientName = assignment.production_plans?.clients?.client_name;
  return clientName ? `${planName} (${clientName})` : planName;
}

export function getPlanRoleAssignmentLabel(
  plan: MemberPlanRoleAssignment,
): string {
  const clientName = plan.clients?.client_name;
  return clientName ? `${plan.plan_name} (${clientName})` : plan.plan_name;
}
