import { useParams } from "react-router";

import { ProductionPlanContentsList } from "@/features/production-planner/components/ProductionPlanContentsList";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import { useSharedPlanQuery } from "@/features/share/hooks/useSharedPlanQuery";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function SharedProductionPlanPage() {
  const { token = "" } = useParams();
  const { view, isLoading, error } = useSharedPlanQuery(token);

  if (isLoading) {
    return <DetailPageLoading />;
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader heading="Shared production plan" />
        <ErrorBanner message={error ?? "This share link is invalid."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={view.plan.plan_name}
        description="View-only production plan. Refresh the page to see the latest data."
      />
      {error ? <ErrorBanner message={error} /> : null}
      <ProductionPlanSummaryCard plan={view.plan} />
      <ProductionPlanContentsList
        contents={view.contents}
        isLoading={false}
        canEdit={false}
        canEditManagerApproval={false}
        canEditShootInchargeApproval={false}
        canEditClientApproval={false}
        lockDetails
        showMutations={false}
        emptyMessage="No content in this plan yet."
        onSave={async () => undefined}
        onDuplicate={async () => undefined}
        onDelete={async () => undefined}
      />
    </PageContent>
  );
}
