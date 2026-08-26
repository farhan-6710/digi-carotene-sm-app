import { format } from "date-fns";

import { buildClientProductionPlanDetailPath } from "@/features/client-portal/constants/routes";
import {
  CLIENT_PLANS_ROW_GRID_CLASS,
  clientPlansDirectoryConfig,
} from "@/features/client-portal/constants/productionPlannerDirectory";
import type { ClientProductionPlansTableProps } from "@/features/client-portal/types/components";
import { formatPlanDeliverables } from "@/features/production-planner/utils/productionPlanFormUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { cn } from "@/shared/lib/utils";

export function ClientProductionPlansTable({
  plans,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ClientProductionPlansTableProps) {
  return (
    <DirectoryTable
      title={clientPlansDirectoryConfig.title}
      description={clientPlansDirectoryConfig.description}
      gridClass={clientPlansDirectoryConfig.gridClass}
      columns={clientPlansDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No production plans match that search."
          : clientPlansDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={plans.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search plans"
          disabled={isLoading}
        />
      }
    >
      {plans.map((plan) => (
        <DirectoryTableRow
          key={plan.id}
          to={buildClientProductionPlanDetailPath(plan.id)}
          className={cn(
            "grid items-center gap-2 px-6 py-4 sm:gap-4",
            CLIENT_PLANS_ROW_GRID_CLASS,
          )}
        >
          <p className="text-sm font-medium text-foreground">
            {plan.plan_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {plan.shoot_date
              ? format(new Date(plan.shoot_date), "MMM d, yyyy")
              : "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatPlanDeliverables(plan) || "—"}
          </p>
        </DirectoryTableRow>
      ))}
    </DirectoryTable>
  );
}
