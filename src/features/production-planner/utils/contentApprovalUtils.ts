import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";
import type { TeamMemberRole } from "@/features/team-management/constants/teamMemberRoles";

/** Worst status across approvers — rejected > pending > approved. */
export function getOverallApprovalStatus(
  manager: ProductionPlanApprovalStatus,
  shootIncharge: ProductionPlanApprovalStatus,
  client: ProductionPlanApprovalStatus,
): ProductionPlanApprovalStatus {
  if (
    manager === "rejected" ||
    shootIncharge === "rejected" ||
    client === "rejected"
  ) {
    return "rejected";
  }
  if (
    manager === "pending" ||
    shootIncharge === "pending" ||
    client === "pending"
  ) {
    return "pending";
  }
  return "approved";
}

export function formatContentIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function canEditManagerOrClientApproval(
  role: TeamMemberRole | null,
): boolean {
  return role === "admin" || role === "manager";
}
