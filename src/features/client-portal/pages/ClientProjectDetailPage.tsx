import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CLIENT_PROJECTS_PATH } from "@/features/client-portal/constants/routes";
import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { useProjectDetailQuery } from "@/features/projects-management/hooks/useProjectDetailQuery";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { useDateFiltersTwo } from "@/shared/hooks/useDateFiltersTwo";
import { Button } from "@/shared/ui/button";
import { resolveDateFiltersTwoRange } from "@/shared/utils/dateFiltersTwoUtils";

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

export function ClientProjectDetailPage() {
  const { projectId = "" } = useParams();
  const { clientId } = useAuth();
  const { project, posts, teamMembers, isLoading, error } =
    useProjectDetailQuery(projectId);
  const { filter, dateFilterProps } = useDateFiltersTwo();
  const belongsToClient = Boolean(
    project && clientId && project.client_id === clientId,
  );
  const dateFilteredPosts = useMemo(() => {
    const range = resolveDateFiltersTwoRange(filter);
    return range ? filterPostsByDateRange(posts, range) : posts;
  }, [filter, posts]);
  const postStats = useMemo(
    () => buildProjectPostStats(dateFilteredPosts),
    [dateFilteredPosts],
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
        description="View-only project details for your brand."
        backButton={<BackButton />}
        actions={<DateFiltersTwo {...dateFilterProps} />}
      />
      {error ? <ErrorBanner message={error} /> : null}
      <ProjectProfileCard
        project={project}
        postStats={postStats}
        teamMembers={teamMembers}
        hideClientLink
      />
      <ProjectPostsTable posts={dateFilteredPosts} isLoading={false} />
    </PageContent>
  );
}
