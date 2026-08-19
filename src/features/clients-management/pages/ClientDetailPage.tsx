import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ClientProfileCard } from "@/features/clients-management/components/ClientProfileCard";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/clients-management/constants/routes";
import { useClientDetailQuery } from "@/features/clients-management/hooks/useClientDetailQuery";
import { ClientProductionPlansSection } from "@/features/production-planner/components/ClientProductionPlansSection";
import { ClientProjectsSection } from "@/features/projects-management/components/ClientProjectsSection";
import { PageContent } from "@/shared/components/PageContent";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
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

  const { client, projects, productionPlans, isLoading, error } =
    useClientDetailQuery(clientId);

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
      <PageHeader backButton={<ClientDetailBackButton />} />

      {error ? <ErrorBanner message={error} /> : null}

      <ClientProfileCard client={client} />

      <ClientProjectsSection projects={projects} isLoading={isLoading} />

      <ClientProductionPlansSection
        plans={productionPlans}
        isLoading={isLoading}
      />
    </PageContent>
  );
}
