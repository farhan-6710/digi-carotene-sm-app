import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CLIENT_PROJECTS_PATH } from "@/features/client-portal/constants/routes";
import { OtherProjectProfileCard } from "@/features/other-projects/components/OtherProjectProfileCard";
import { useOtherProjectDetailQuery } from "@/features/other-projects/hooks/useOtherProjectDetailQuery";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function BackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={CLIENT_PROJECTS_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to projects
      </Link>
    </Button>
  );
}

export function ClientOtherProjectDetailPage() {
  const { projectId = "" } = useParams();
  const { clientId } = useAuth();
  const { project, isLoading, error } = useOtherProjectDetailQuery(projectId);
  const belongsToClient = Boolean(
    project && clientId && project.client_id === clientId,
  );

  if (isLoading) {
    return <DetailPageLoading backButton={<BackButton />} />;
  }

  if (!project || !belongsToClient) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<BackButton />} />
        <ErrorBanner message={error ?? "Project not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={project.project_name}
        description="View-only other project details for your brand."
        backButton={<BackButton />}
      />
      {error ? <ErrorBanner message={error} /> : null}
      <OtherProjectProfileCard project={project} hideClientLink />
    </PageContent>
  );
}
