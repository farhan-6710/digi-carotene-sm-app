import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";

export const PRODUCTION_PLAN_APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const satisfies readonly ProductionPlanApprovalStatus[];

export const PRODUCTION_PLAN_APPROVAL_STATUS_LABELS: Record<
  ProductionPlanApprovalStatus,
  string
> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};
