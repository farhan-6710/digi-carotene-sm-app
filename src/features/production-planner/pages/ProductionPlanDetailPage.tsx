import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { ProductionPlanItemDialog } from "@/features/production-planner/components/ProductionPlanItemDialog";
import { ProductionPlanItemsTable } from "@/features/production-planner/components/ProductionPlanItemsTable";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { useProductionPlanDetailQuery } from "@/features/production-planner/hooks/useProductionPlanDetailQuery";
import { useProductionPlanItemDialog } from "@/features/production-planner/hooks/useProductionPlanItemDialog";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function PlanDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={PRODUCTION_PLANNER_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to plans
      </Link>
    </Button>
  );
}

export function ProductionPlanDetailPage() {
  const { planId = "" } = useParams();
  const { can } = usePermissions();
  const canCreate = can("productionPlans.create");
  const canUpdate = can("productionPlans.update");
  const canManage = canCreate || canUpdate;

  const { plan, items, isLoading, error, setError, reload } =
    useProductionPlanDetailQuery(planId);
  const { openAddDialog, openEditDialog, dialog } = useProductionPlanItemDialog(
    {
      productionPlanId: planId,
      reload,
      setError,
    },
  );

  if (isLoading) {
    return <DetailPageLoading backButton={<PlanDetailBackButton />} />;
  }

  if (!plan) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<PlanDetailBackButton />} />
        <ErrorBanner message={error ?? "Production plan not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={plan.plan_name}
        description="Review plan details and manage individual items with approval status."
        backButton={<PlanDetailBackButton />}
        actions={
          canCreate ? (
            <Button
              onClick={openAddDialog}
              className="cursor-pointer rounded-full shadow-sm"
            >
              <Plus className="mr-2 size-4" />
              Add Item
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <ProductionPlanSummaryCard plan={plan} />

      <ProductionPlanItemsTable
        items={items}
        isLoading={false}
        canEdit={canUpdate}
        onEdit={openEditDialog}
      />

      {canManage ? <ProductionPlanItemDialog {...dialog} /> : null}
    </PageContent>
  );
}
