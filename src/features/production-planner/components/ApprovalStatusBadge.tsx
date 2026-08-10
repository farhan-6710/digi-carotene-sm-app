import { cn } from "@/shared/lib/utils";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";

const statusStyles: Record<ProductionPlanApprovalStatus, string> = {
  pending:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  approved:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  rejected:
    "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
};

const statusLabels: Record<ProductionPlanApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

type ApprovalStatusBadgeProps = {
  status: ProductionPlanApprovalStatus;
};

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase",
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
