import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProductionPlanContentsList } from "@/features/production-planner/components/ProductionPlanContentsList";
import { ProductionPlanDialog } from "@/features/production-planner/components/ProductionPlanDialog";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import { PRODUCTION_PLANNER_PATH } from "@/features/production-planner/constants/routes";
import { ShareLinkButton } from "@/features/share/components/ShareLinkButton";
import { canGenerateShareLink } from "@/features/share/utils/shareAccess";
import { copyProductionPlanShareLink } from "@/services/shareService";
import { useDraftPlanContent } from "@/features/production-planner/hooks/useDraftPlanContent";
import { useProductionPlanDetailQuery } from "@/features/production-planner/hooks/useProductionPlanDetailQuery";
import { useProductionPlanDialog } from "@/features/production-planner/hooks/useProductionPlanDialog";
import type { ProductionPlanContentSavePayload } from "@/features/production-planner/types/components";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import { canEditManagerOrClientApproval } from "@/features/production-planner/utils/contentApprovalUtils";
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
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { teamRole, teamMemberId } = useAuth();
  const { plan, contents, canEditContent, isLoading, error, setError, reload } =
    useProductionPlanDetailQuery(planId);
  const { draftContent, draftFocusKey, startDraft, discardDraft, isDraftId } =
    useDraftPlanContent(planId);
  const { openEditDialog, dialog } = useProductionPlanDialog({
    reload,
    setError,
  });
  const canEditPlan = can("productionPlans.update");

  const canEditManagerApproval = canEditManagerOrClientApproval(teamRole);
  const canEditClientApproval = canEditManagerApproval;
  const canEditShootInchargeApproval =
    Boolean(teamMemberId) && teamMemberId === plan?.shoot_incharge_id;

  const handleSaveContent = async (
    id: string,
    payload: ProductionPlanContentSavePayload,
  ) => {
    try {
      if (isDraftId(id)) {
        await createProductionPlanItem({
          productionPlanId: planId,
          ...payload,
        });
        showToast("success", `"${payload.itemName}" added successfully.`);
        discardDraft();
      } else {
        await updateProductionPlanItem(id, payload);
        showToast("success", `"${payload.itemName}" updated successfully.`);
      }
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save content.";
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
        script: content.script,
        referenceLink: content.reference_link,
        managerApproval: "pending",
        shootInchargeApproval: "pending",
        clientApproval: "pending",
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
    if (isDraftId(id)) {
      discardDraft();
      return;
    }

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
          <div className="flex flex-wrap items-center gap-2">
            {canEditPlan ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => openEditDialog(plan)}
              >
                <Pencil className="mr-2 size-4" />
                Edit Plan
              </Button>
            ) : null}
            <ShareLinkButton
              canShare={canGenerateShareLink(
                teamRole,
                teamMemberId,
                plan.manager_id,
              )}
              onCopy={() => copyProductionPlanShareLink(plan.id)}
            />
            {canEditContent ? (
              <Button
                onClick={startDraft}
                className="cursor-pointer rounded-full shadow-sm"
              >
                <Plus className="mr-2 size-4" />
                Add Content
              </Button>
            ) : null}
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <ProductionPlanSummaryCard plan={plan} />

      <ProductionPlanContentsList
        contents={contents}
        isLoading={false}
        canEdit={canEditContent}
        canEditManagerApproval={canEditManagerApproval}
        canEditShootInchargeApproval={canEditShootInchargeApproval}
        canEditClientApproval={canEditClientApproval}
        draftContent={draftContent}
        draftFocusKey={draftFocusKey}
        onSave={handleSaveContent}
        onDuplicate={handleDuplicateContent}
        onDelete={handleDeleteContent}
        onDiscardDraft={discardDraft}
      />

      {canEditPlan ? (
        <ProductionPlanDialog
          {...dialog}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(PRODUCTION_PLANNER_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
