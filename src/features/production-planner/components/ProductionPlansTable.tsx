import { format } from "date-fns";
import { Pencil } from "lucide-react";

import { productionPlannerDirectoryConfig } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlansTableProps } from "@/features/production-planner/types/components";
import type {
  ProductionPlan,
  ProductionPlanApprovalStatus,
} from "@/features/production-planner/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type StatusBadgeProps = {
  status: ProductionPlanApprovalStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = {
    pending:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    approved:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    rejected:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}

type ProductionPlanRowProps = {
  plan: ProductionPlan;
  canEdit: boolean;
  onEdit: (plan: ProductionPlan) => void;
};

function ProductionPlanRow({ plan, canEdit, onEdit }: ProductionPlanRowProps) {
  const clientName = plan.clients?.client_name ?? "Unknown Client";
  const startDateFormatted = plan.start_date
    ? format(new Date(plan.start_date), "MMM d, yyyy")
    : "—";

  const deliverableSummary = [
    plan.reels_count > 0
      ? `${plan.reels_count} reel${plan.reels_count > 1 ? "s" : ""}`
      : null,
    plan.images_count > 0
      ? `${plan.images_count} image${plan.images_count > 1 ? "s" : ""}`
      : null,
    plan.carousels_count > 0
      ? `${plan.carousels_count} carousel${plan.carousels_count > 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "grid items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/10",
        productionPlannerDirectoryConfig.gridClass,
      )}
    >
      <div className="min-w-0">
        {canEdit ? (
          <button
            type="button"
            onClick={() => onEdit(plan)}
            className="cursor-pointer text-left text-sm font-semibold text-primary outline-none hover:underline"
          >
            {plan.plan_name}
          </button>
        ) : (
          <p className="text-sm font-semibold text-foreground">
            {plan.plan_name}
          </p>
        )}
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{clientName}</span>
          <span className="text-muted-foreground/40">•</span>
          <span>Starts {startDateFormatted}</span>
          {deliverableSummary ? (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="italic text-muted-foreground/80">
                {deliverableSummary}
              </span>
            </>
          ) : null}
        </p>
      </div>

      <div>
        <StatusBadge status={plan.manager_approval} />
      </div>

      <div>
        <StatusBadge status={plan.shoot_incharge_approval} />
      </div>

      <div className="flex justify-end">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(plan)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit plan</span>
          </Button>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>
    </div>
  );
}

export function ProductionPlansTable({
  plans,
  isLoading,
  canEdit,
  onEdit,
}: ProductionPlansTableProps) {
  return (
    <DirectoryTable
      title={productionPlannerDirectoryConfig.title}
      description={productionPlannerDirectoryConfig.description}
      gridClass={productionPlannerDirectoryConfig.gridClass}
      columns={[...productionPlannerDirectoryConfig.columns]}
      emptyMessage={productionPlannerDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={plans.length === 0}
    >
      {plans.map((plan) => (
        <ProductionPlanRow
          key={plan.id}
          plan={plan}
          canEdit={canEdit}
          onEdit={onEdit}
        />
      ))}
    </DirectoryTable>
  );
}
