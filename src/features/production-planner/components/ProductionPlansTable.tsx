import { format } from "date-fns";
import { Link } from "react-router";
import { Pencil } from "lucide-react";

import {
  PRODUCTION_PLANNER_ROW_GRID_CLASS,
  productionPlannerDirectoryConfig,
} from "@/features/production-planner/constants/productionPlannerDirectory";
import { buildProductionPlanDetailPath } from "@/features/production-planner/constants/routes";
import type { ProductionPlansTableProps } from "@/features/production-planner/types/components";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import { formatPlanDeliverables } from "@/features/production-planner/utils/productionPlanFormUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ProductionPlanRowProps = {
  plan: ProductionPlan;
  canEdit: boolean;
  onEdit: (plan: ProductionPlan) => void;
};

function ProductionPlanRow({ plan, canEdit, onEdit }: ProductionPlanRowProps) {
  const clientName = plan.clients?.client_name ?? "—";
  const shootDateFormatted = plan.shoot_date
    ? format(new Date(plan.shoot_date), "MMM d, yyyy")
    : "—";
  const deliverables = formatPlanDeliverables(plan);

  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        PRODUCTION_PLANNER_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PLAN
        </span>
        <Link
          to={buildProductionPlanDetailPath(plan.id)}
          className="hover:text-primary hover:underline"
        >
          {plan.plan_name}
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          CLIENT
        </span>
        {clientName}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SHOOT DATE
        </span>
        {shootDateFormatted}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          DELIVERABLES
        </span>
        {deliverables || (
          <span className="text-muted-foreground/50">—</span>
        )}
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
        ) : null}
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
