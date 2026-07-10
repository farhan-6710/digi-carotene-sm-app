import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";
import { useProjectDetailQuery } from "@/features/projects-management/hooks/useProjectDetailQuery";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { PageContent } from "@/shared/components/PageContent";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function ProjectDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={PROJECTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to projects
      </Link>
    </Button>
  );
}

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const [dialogError, setDialogError] = useState<string | null>(null);
  const { project, posts, teamMembers, isLoading, error, reload } =
    useProjectDetailQuery(projectId);
  const postStats = useMemo(() => buildProjectPostStats(posts), [posts]);
  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload,
    setError: setDialogError,
  });

  if (isLoading) {
    return <DetailPageLoading backButton={<ProjectDetailBackButton />} />;
  }

  if (!project) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<ProjectDetailBackButton />} />
        <ErrorBanner message={error ?? "Project not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader backButton={<ProjectDetailBackButton />} />

      {error ? <ErrorBanner message={error} /> : null}
      {dialogError ? <ErrorBanner message={dialogError} /> : null}

      <ProjectProfileCard
        project={project}
        postStats={postStats}
        teamMembers={teamMembers}
      />

      <ProjectPostsTable
        posts={posts}
        isLoading={isLoading}
        onEditPost={openEditDialogFromPost}
      />

      <PostDialog {...dialog} />
    </PageContent>
  );
}
