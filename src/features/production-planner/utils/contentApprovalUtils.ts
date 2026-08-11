import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";

/** Worst status across both approvers — rejected > pending > approved. */
export function getOverallApprovalStatus(
  manager: ProductionPlanApprovalStatus,
  shootIncharge: ProductionPlanApprovalStatus,
): ProductionPlanApprovalStatus {
  if (manager === "rejected" || shootIncharge === "rejected") {
    return "rejected";
  }
  if (manager === "pending" || shootIncharge === "pending") {
    return "pending";
  }
  return "approved";
}

export function formatContentIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
