import type {
  ProductionPlan,
  ProductionPlanApprovalStatus,
} from "@/features/production-planner/types/types";
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

export function areAllContentApprovalsApproved(
  manager: ProductionPlanApprovalStatus,
  shootIncharge: ProductionPlanApprovalStatus,
  client: ProductionPlanApprovalStatus,
): boolean {
  return (
    manager === "approved" &&
    shootIncharge === "approved" &&
    client === "approved"
  );
}

export function formatContentIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function canEditManagerOrClientApproval(
  role: TeamMemberRole | null,
): boolean {
  return role === "admin" || role === "manager";
}

/** Admin, this plan's manager, or this plan's shoot incharge. */
export function canEditShootCompleted(
  role: TeamMemberRole | null,
  teamMemberId: string | null,
  plan: Pick<ProductionPlan, "manager_id" | "shoot_incharge_id"> | null,
): boolean {
  if (!plan) return false;
  if (role === "admin") return true;
  if (!teamMemberId) return false;
  return (
    teamMemberId === plan.manager_id ||
    teamMemberId === plan.shoot_incharge_id
  );
}
