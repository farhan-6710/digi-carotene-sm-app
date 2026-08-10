import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { ProductionPlanContentDialog } from "@/features/production-planner/components/ProductionPlanContentDialog";
import { ProductionPlanContentsTable } from "@/features/production-planner/components/ProductionPlanContentsTable";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { useProductionPlanDetailQuery } from "@/features/production-planner/hooks/useProductionPlanDetailQuery";
import { useProductionPlanContentDialog } from "@/features/production-planner/hooks/useProductionPlanContentDialog";
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

  const { plan, contents, isLoading, error, setError, reload } =
    useProductionPlanDetailQuery(planId);
  const { openAddDialog, openEditDialog, dialog } = useProductionPlanContentDialog(
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
        description="Review plan details and manage individual content with approval status."
        backButton={<PlanDetailBackButton />}
        actions={
          canCreate ? (
            <Button
              onClick={openAddDialog}
              className="cursor-pointer rounded-full shadow-sm"
            >
              <Plus className="mr-2 size-4" />
              Add Content
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <ProductionPlanSummaryCard plan={plan} />

      <ProductionPlanContentsTable
        contents={contents}
        isLoading={false}
        canEdit={canUpdate}
        onEdit={openEditDialog}
      />

      {canManage ? <ProductionPlanContentDialog {...dialog} /> : null}
    </PageContent>
  );
}
