import { format } from "date-fns";

import type { ProductionPlan } from "@/features/production-planner/types/types";
import { formatPlanDeliverables } from "@/features/production-planner/utils/productionPlanFormUtils";

type ProductionPlanSummaryCardProps = {
  plan: ProductionPlan;
};

export function ProductionPlanSummaryCard({
  plan,
}: ProductionPlanSummaryCardProps) {
  const clientName = plan.clients?.client_name ?? "—";
  const managerName = plan.manager?.member_name ?? "—";
  const shootInchargeName = plan.shoot_incharge?.member_name ?? "—";
  const shootDate = plan.shoot_date
    ? format(new Date(plan.shoot_date), "MMMM d, yyyy")
    : "—";
  const deliverables = formatPlanDeliverables(plan);

  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{plan.plan_name}</h2>
      {plan.plan_description ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {plan.plan_description}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Client
          </p>
          <p className="mt-1 font-medium text-foreground">{clientName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Manager
          </p>
          <p className="mt-1 font-medium text-foreground">{managerName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Shoot incharge
          </p>
          <p className="mt-1 font-medium text-foreground">
            {shootInchargeName}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Shoot date
          </p>
          <p className="mt-1 font-medium text-foreground">{shootDate}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Deliverables
          </p>
          <p className="mt-1 font-medium text-foreground">
            {deliverables || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
