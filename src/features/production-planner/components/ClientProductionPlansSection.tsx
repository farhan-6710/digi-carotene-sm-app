import { format } from "date-fns";
import { Link } from "react-router";

import {
  buildProductionPlanDetailPath,
  PRODUCTION_PLANNER_PATH,
} from "@/features/production-planner/constants/routes";
import type { ClientProductionPlansSectionProps } from "@/features/production-planner/types/components";

export function ClientProductionPlansSection({
  plans,
  isLoading,
}: ClientProductionPlansSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">Production plans</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Shoot schedules and content for this client.
        </p>
      </div>

      {isLoading ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          Loading production plans...
        </div>
      ) : plans.length === 0 ? (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          No production plans yet.{" "}
          <Link to={PRODUCTION_PLANNER_PATH} className="text-primary hover:underline">
            Create a plan
          </Link>{" "}
          for this client.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {plans.map((plan) => {
            const shootDate = plan.shoot_date
              ? format(new Date(plan.shoot_date), "MMM d, yyyy")
              : "—";

            return (
              <div
                key={plan.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    <Link
                      to={buildProductionPlanDetailPath(plan.id)}
                      className="hover:text-primary hover:underline"
                    >
                      {plan.plan_name}
                    </Link>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Shoot date: {shootDate}
                    {plan.manager
                      ? ` · Manager: ${plan.manager.member_name}`
                      : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
