import { Link, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { ClientDialog } from "@/features/clients-management/components/ClientDialog";
import { ClientProfileCard } from "@/features/clients-management/components/ClientProfileCard";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/clients-management/constants/routes";
import { useClientDetailQuery } from "@/features/clients-management/hooks/useClientDetailQuery";
import { useClientDialog } from "@/features/clients-management/hooks/useClientDialog";
import { ClientProductionPlansSection } from "@/features/production-planner/components/ClientProductionPlansSection";
import { ClientProjectsSection } from "@/features/projects-management/components/ClientProjectsSection";
import { PageContent } from "@/shared/components/PageContent";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function ClientDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={CLIENTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to clients
      </Link>
    </Button>
  );
}

export function ClientDetailPage() {
  const { clientId = "" } = useParams();
  const { can } = usePermissions();
  const { client, projects, productionPlans, isLoading, error, setError, reload } =
    useClientDetailQuery(clientId);
  const { openEditDialog, dialog } = useClientDialog({
    reload,
    setError,
  });

  if (isLoading) {
    return <DetailPageLoading backButton={<ClientDetailBackButton />} />;
  }

  if (!client) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<ClientDetailBackButton />} />
        <ErrorBanner message={error ?? "Client not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        backButton={<ClientDetailBackButton />}
        actions={
          can("clients.update") ? (
            <Button
              type="button"
              className="rounded-full shadow-sm"
              onClick={() => openEditDialog(client)}
            >
              <Pencil className="mr-2 size-4" />
              Edit Client
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <ClientProfileCard client={client} />

      <ClientProjectsSection projects={projects} isLoading={isLoading} />

      <ClientProductionPlansSection
        plans={productionPlans}
        isLoading={isLoading}
      />

      {can("clients.update") ? <ClientDialog {...dialog} /> : null}
    </PageContent>
  );
}
