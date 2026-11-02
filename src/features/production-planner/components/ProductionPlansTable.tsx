import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useMemo } from "react";

import { ProductionPlanClientFilter } from "@/features/production-planner/components/ProductionPlanClientFilter";
import {
  PRODUCTION_PLANNER_BULK_GRID_CLASS,
  PRODUCTION_PLANNER_BULK_ROW_GRID_CLASS,
  PRODUCTION_PLANNER_ROW_GRID_CLASS,
  productionPlannerColumns,
  productionPlannerDirectoryConfig,
} from "@/features/production-planner/constants/productionPlannerDirectory";
import { buildProductionPlanDetailPath } from "@/features/production-planner/constants/routes";
import type { ProductionPlansTableProps } from "@/features/production-planner/types/components";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import { formatPlanDeliverables } from "@/features/production-planner/utils/productionPlanFormUtils";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import type { DirectoryTableColumn } from "@/shared/types/components";

type ProductionPlanRowProps = {
  plan: ProductionPlan;
  canEdit: boolean;
  canDelete?: boolean;
  selected?: boolean;
  onToggleSelect?: (planId: string) => void;
  onEdit: (plan: ProductionPlan) => void;
};

function ProductionPlanRow({
  plan,
  canEdit,
  canDelete = false,
  selected = false,
  onToggleSelect,
  onEdit,
}: ProductionPlanRowProps) {
  const clientName = plan.clients?.client_name ?? "—";
  const shootDateFormatted = plan.shoot_date
    ? format(new Date(plan.shoot_date), "MMM d, yyyy")
    : "—";
  const deliverables = formatPlanDeliverables(plan);

  return (
    <DirectoryTableRow
      to={buildProductionPlanDetailPath(plan.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        canDelete
          ? PRODUCTION_PLANNER_BULK_ROW_GRID_CLASS
          : PRODUCTION_PLANNER_ROW_GRID_CLASS,
      )}
    >
      {canDelete && onToggleSelect ? (
        <DirectoryBulkCheckbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(plan.id)}
          ariaLabel={`Select ${plan.plan_name}`}
        />
      ) : null}
      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PLAN
        </span>
        <span className="truncate">{plan.plan_name}</span>
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
            onClick={(event) => {
              stopDirectoryRowNav(event);
              onEdit(plan);
            }}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit plan</span>
          </Button>
        ) : null}
      </div>
    </DirectoryTableRow>
  );
}

export function ProductionPlansTable({
  plans,
  isLoading,
  canEdit,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  onEdit,
  clientFilter,
  onClientFilterChange,
  clientOptions,
}: ProductionPlansTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return productionPlannerColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all production plans"
            disabled={isLoading || plans.length === 0}
          />
        ),
      },
      ...productionPlannerColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    isLoading,
    onToggleAllVisible,
    plans.length,
  ]);

  return (
    <DirectoryTable
      title={productionPlannerDirectoryConfig.title}
      description={productionPlannerDirectoryConfig.description}
      gridClass={
        canDelete
          ? PRODUCTION_PLANNER_BULK_GRID_CLASS
          : productionPlannerDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={productionPlannerDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={plans.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {canDelete && onClearSelection && onBulkDelete ? (
            <DirectoryBulkDeleteBar
              selectedCount={selectedIds.length}
              singularLabel="plan"
              pluralLabel="plans"
              isDeleting={isDeleting}
              onClear={onClearSelection}
              onConfirmDelete={onBulkDelete}
            />
          ) : null}
          <ProductionPlanClientFilter
            value={clientFilter}
            onChange={onClientFilterChange}
            clients={clientOptions}
            disabled={isLoading}
          />
        </div>
      }
    >
      {plans.map((plan) => (
        <ProductionPlanRow
          key={plan.id}
          plan={plan}
          canEdit={canEdit}
          canDelete={canDelete}
          selected={selectedSet.has(plan.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEdit}
        />
      ))}
    </DirectoryTable>
  );
}
