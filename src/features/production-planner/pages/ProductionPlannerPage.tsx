import { useMemo } from "react";
import { Plus } from "lucide-react";

import { ProductionPlanDialog } from "@/features/production-planner/components/ProductionPlanDialog";
import { ProductionPlansTable } from "@/features/production-planner/components/ProductionPlansTable";
import { PRODUCTION_PLANNER_ALL_CLIENTS } from "@/features/production-planner/constants/routes";
import { useProductionPlanDialog } from "@/features/production-planner/hooks/useProductionPlanDialog";
import { useProductionPlannerClientFilter } from "@/features/production-planner/hooks/useProductionPlannerClientFilter";
import { useProductionPlansQuery } from "@/features/production-planner/hooks/useProductionPlansQuery";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

export function ProductionPlannerPage() {
  const { can } = usePermissions();
  const canCreate = can("productionPlans.create");
  const canUpdate = can("productionPlans.update");
  const canManage = canCreate || canUpdate;

  const { plans, clients, isLoading, error, setError, reload } =
    useProductionPlansQuery();
  const { selectedClientId, setSelectedClientId } =
    useProductionPlannerClientFilter();
  const { openAddDialog, openEditDialog, dialog } = useProductionPlanDialog({
    reload,
    setError,
  });

  const clientOptions = useMemo(
    () =>
      [...clients]
        .sort((a, b) => a.client_name.localeCompare(b.client_name))
        .map((client) => ({ value: client.id, label: client.client_name })),
    [clients],
  );

  const filteredPlans = useMemo(() => {
    if (selectedClientId === PRODUCTION_PLANNER_ALL_CLIENTS) {
      return plans;
    }
    return plans.filter((plan) => plan.client_id === selectedClientId);
  }, [plans, selectedClientId]);

  return (
    <PageShell
      heading="Production Planner"
      description="Create production plans for clients, then open a plan to add content and track approvals."
      error={error}
      actions={
        canCreate ? (
          <Button
            onClick={openAddDialog}
            className="cursor-pointer rounded-full shadow-sm"
          >
            <Plus className="mr-2 size-4" />
            Add Plan
          </Button>
        ) : null
      }
      dialog={canManage ? <ProductionPlanDialog {...dialog} /> : null}
    >
      <ProductionPlansTable
        plans={filteredPlans}
        isLoading={isLoading}
        canEdit={canUpdate}
        onEdit={openEditDialog}
        clientFilter={selectedClientId}
        onClientFilterChange={setSelectedClientId}
        clientOptions={clientOptions}
      />
    </PageShell>
  );
}
