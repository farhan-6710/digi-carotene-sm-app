import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ClientProfileCard } from "@/features/clients-management/components/ClientProfileCard";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/clients-management/constants/routes";
import { useClientDetailQuery } from "@/features/clients-management/hooks/useClientDetailQuery";
import { ClientProjectsSection } from "@/features/projects-management/components/ClientProjectsSection";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
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

  const { client, projects, isLoading, error } = useClientDetailQuery(clientId);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
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
    <section className="space-y-8">
      <PageHeader backButton={<ClientDetailBackButton />} />

      {error ? <ErrorBanner message={error} /> : null}

      <ClientProfileCard client={client} />

      <ClientProjectsSection projects={projects} isLoading={isLoading} />
    </section>
  );
}
