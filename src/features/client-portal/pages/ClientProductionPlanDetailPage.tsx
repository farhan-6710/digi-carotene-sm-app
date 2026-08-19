import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { CLIENT_PRODUCTION_PLANNER_PATH } from "@/features/client-portal/constants/routes";
import { useClientProductionPlanDetailQuery } from "@/features/client-portal/hooks/useClientProductionPlanDetailQuery";
import { ProductionPlanContentsList } from "@/features/production-planner/components/ProductionPlanContentsList";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import type { ProductionPlanContentSavePayload } from "@/features/production-planner/types/components";
import { updateProductionPlanItem } from "@/services/productionPlanItemsService";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/utils/showToast";

function BackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={CLIENT_PRODUCTION_PLANNER_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to plans
      </Link>
    </Button>
  );
}

export function ClientProductionPlanDetailPage() {
  const { planId = "" } = useParams();
  const { plan, contents, isLoading, error, setError, reload } =
    useClientProductionPlanDetailQuery(planId);

  const handleSave = async (
    id: string,
    payload: ProductionPlanContentSavePayload,
  ) => {
    try {
      await updateProductionPlanItem(id, {
        clientApproval: payload.clientApproval,
      });
      showToast("success", "Client approval updated.");
      await reload();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update approval.";
      setError(message);
      showToast("error", message);
      throw err;
    }
  };

  if (isLoading) {
    return <DetailPageLoading backButton={<BackButton />} />;
  }

  if (!plan) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<BackButton />} />
        <ErrorBanner message={error ?? "Production plan not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={plan.plan_name}
        description="Update Client approval on each content item. Other fields are view-only."
        backButton={<BackButton />}
      />
      {error ? <ErrorBanner message={error} /> : null}
      <ProductionPlanSummaryCard plan={plan} />
      <ProductionPlanContentsList
        contents={contents}
        isLoading={false}
        canEdit
        canEditManagerApproval={false}
        canEditShootInchargeApproval={false}
        canEditClientApproval
        lockDetails
        showMutations={false}
        emptyMessage="No content in this plan yet."
        onSave={handleSave}
        onDuplicate={async () => undefined}
        onDelete={async () => undefined}
      />
    </PageContent>
  );
}
