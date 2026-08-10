import { Plus } from "lucide-react";

import { ProductionPlanDialog } from "@/features/production-planner/components/ProductionPlanDialog";
import { ProductionPlansTable } from "@/features/production-planner/components/ProductionPlansTable";
import { useProductionPlanDialog } from "@/features/production-planner/hooks/useProductionPlanDialog";
import { useProductionPlansQuery } from "@/features/production-planner/hooks/useProductionPlansQuery";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

export function ProductionPlannerPage() {
  const { can } = usePermissions();
  const canCreate = can("productionPlans.create");
  const canUpdate = can("productionPlans.update");
  const canManage = canCreate || canUpdate;

  const { plans, isLoading, error, setError, reload } = useProductionPlansQuery();
  const { openAddDialog, openEditDialog, dialog } = useProductionPlanDialog({
    reload,
    setError,
  });

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
        plans={plans}
        isLoading={isLoading}
        canEdit={canUpdate}
        onEdit={openEditDialog}
      />
    </PageShell>
  );
}
