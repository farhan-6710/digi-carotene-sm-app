import { useParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProductionPlanContentsList } from "@/features/production-planner/components/ProductionPlanContentsList";
import { ProductionPlanSummaryCard } from "@/features/production-planner/components/ProductionPlanSummaryCard";
import type { ProductionPlanContentSavePayload } from "@/features/production-planner/types/components";
import { useSharedPlanQuery } from "@/features/share/hooks/useSharedPlanQuery";
import { isAssociatedClient } from "@/features/share/utils/shareAccess";
import { updateSharedPlanItemClientApproval } from "@/services/shareService";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { showToast } from "@/shared/utils/showToast";

export function SharedProductionPlanPage() {
  const { token = "" } = useParams();
  const { user, clientId, loading: authLoading } = useAuth();
  const { view, isLoading, error, setError, reload } = useSharedPlanQuery(token);

  const canEditClientApproval = Boolean(
    view &&
      isAssociatedClient({
        userEmail: user?.email,
        profileClientId: clientId,
        entityClientId: view.plan.client_id,
        clientEmail: view.clientEmail,
      }),
  );

  const handleSave = async (
    id: string,
    payload: ProductionPlanContentSavePayload,
  ) => {
    if (!view || !canEditClientApproval) return;
    try {
      await updateSharedPlanItemClientApproval(
        view.shareToken,
        id,
        payload.clientApproval,
      );
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

  if (isLoading || authLoading) {
    return <DetailPageLoading />;
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader heading="Shared production plan" />
        <ErrorBanner message={error ?? "This share link is invalid or expired."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={view.plan.plan_name}
        description={
          canEditClientApproval
            ? "You can update Client approval on each content item."
            : "View-only production plan shared with you."
        }
      />
      {error ? <ErrorBanner message={error} /> : null}
      <ProductionPlanSummaryCard plan={view.plan} />
      <ProductionPlanContentsList
        contents={view.contents}
        isLoading={false}
        canEdit={canEditClientApproval}
        canEditManagerApproval={false}
        canEditShootInchargeApproval={false}
        canEditClientApproval={canEditClientApproval}
        lockDetails
        showMutations={false}
        onSave={handleSave}
        onDuplicate={async () => undefined}
        onDelete={async () => undefined}
      />
    </PageContent>
  );
}
