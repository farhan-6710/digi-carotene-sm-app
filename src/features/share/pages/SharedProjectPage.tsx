import { useMemo } from "react";
import { useParams } from "react-router";

import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { useSharedProjectQuery } from "@/features/share/hooks/useSharedProjectQuery";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function SharedProjectPage() {
  const { token = "" } = useParams();
  const { view, isLoading, error } = useSharedProjectQuery(token);
  const postStats = useMemo(
    () => buildProjectPostStats(view?.posts ?? []),
    [view?.posts],
  );

  if (isLoading) {
    return <DetailPageLoading />;
  }

  if (!view) {
    return (
      <section className="space-y-4">
        <PageHeader heading="Shared project" />
        <ErrorBanner message={error ?? "This share link is invalid."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={view.project.project_name}
        description="View-only project details. Refresh the page to see the latest data."
      />
      {error ? <ErrorBanner message={error} /> : null}
      <ProjectProfileCard
        project={view.project}
        postStats={postStats}
        teamMembers={[]}
        hideClientLink
      />
      <ProjectPostsTable posts={view.posts} isLoading={false} />
    </PageContent>
  );
}
