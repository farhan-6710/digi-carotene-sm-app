import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { ProductionPlanContentDialog } from "@/features/production-planner/components/ProductionPlanContentDialog";
import { ProductionPlanContentsList } from "@/features/production-planner/components/ProductionPlanContentsList";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { useProductionPlanDetailQuery } from "@/features/production-planner/hooks/useProductionPlanDetailQuery";
import { useProductionPlanContentDialog } from "@/features/production-planner/hooks/useProductionPlanContentDialog";
import type {
  ProductionPlanApprovalStatus,
  ProductionPlanContent,
} from "@/features/production-planner/types/types";
import {
  createProductionPlanItem,
  deleteProductionPlanItem,
  updateProductionPlanItem,
} from "@/services/productionPlanItemsService";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/utils/showToast";

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
  const { openAddDialog, dialog } = useProductionPlanContentDialog({
    productionPlanId: planId,
    reload,
    setError,
  });

  const handleSaveContent = async (
    id: string,
    payload: {
      itemName: string;
      itemNotes: string | null;
      managerApproval: ProductionPlanApprovalStatus;
      shootInchargeApproval: ProductionPlanApprovalStatus;
    },
  ) => {
    try {
      await updateProductionPlanItem(id, payload);
      showToast("success", `"${payload.itemName}" updated successfully.`);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update content.";
      setError(message);
      showToast("error", message);
      throw err;
    }
  };

  const handleDuplicateContent = async (content: ProductionPlanContent) => {
    try {
      const copyName = `${content.item_name} (copy)`;
      await createProductionPlanItem({
        productionPlanId: planId,
        itemName: copyName,
        itemNotes: content.item_notes,
        managerApproval: "pending",
        shootInchargeApproval: "pending",
      });
      showToast("success", `"${copyName}" created.`);
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to duplicate content.";
      setError(message);
      showToast("error", message);
      throw err;
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteProductionPlanItem(id);
      showToast("success", "Content deleted successfully.");
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete content.";
      setError(message);
      showToast("error", message);
      throw err;
    }
  };

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

      <ProductionPlanContentsList
        contents={contents}
        isLoading={false}
        canEdit={canUpdate}
        onSave={handleSaveContent}
        onDuplicate={handleDuplicateContent}
        onDelete={handleDeleteContent}
      />

      {canManage ? <ProductionPlanContentDialog {...dialog} /> : null}
    </PageContent>
  );
}
