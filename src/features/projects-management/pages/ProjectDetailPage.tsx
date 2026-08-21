import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { buildAddPostsPath } from "@/features/posts-management/constants/routes";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";
import { useProjectDetailQuery } from "@/features/projects-management/hooks/useProjectDetailQuery";
import { ShareLinkButton } from "@/features/share/components/ShareLinkButton";
import { canGenerateShareLink } from "@/features/share/utils/shareAccess";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { copyProjectShareLink } from "@/services/shareService";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { useDateFiltersTwo } from "@/shared/hooks/useDateFiltersTwo";
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { DateFiltersTwoProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { resolveDateFiltersTwoRange } from "@/shared/utils/dateFiltersTwoUtils";

function ProjectDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={PROJECTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to SM projects
      </Link>
    </Button>
  );
}

function ProjectDetailHeaderActions({
  projectId,
  projectName,
  canCreatePosts,
  canShare,
  dateFilterProps,
}: {
  projectId?: string;
  projectName?: string;
  canCreatePosts: boolean;
  canShare: boolean;
  dateFilterProps: DateFiltersTwoProps;
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <ProjectDetailBackButton />
        {canCreatePosts && projectId && projectName ? (
          <Button asChild className="rounded-full shadow-sm">
            <Link
              to={buildAddPostsPath({
                date: new Date(),
                projectId,
                projectName,
              })}
            >
              <Plus className="mr-2 size-4" />
              Add Post
            </Link>
          </Button>
        ) : null}
        {projectId ? (
          <ShareLinkButton
            canShare={canShare}
            onCopy={() => copyProjectShareLink(projectId)}
          />
        ) : null}
      </div>
      <DateFiltersTwo {...dateFilterProps} />
    </div>
  );
}

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const { can } = usePermissions();
  const { teamRole, teamMemberId } = useAuth();
  const [dialogError, setDialogError] = useState<string | null>(null);
  const { project, posts, teamMembers, isLoading, error, reload } =
    useProjectDetailQuery(projectId);
  const { filter, dateFilterProps } = useDateFiltersTwo();
  const dateFilteredPosts = useMemo(() => {
    const range = resolveDateFiltersTwoRange(filter);
    return range ? filterPostsByDateRange(posts, range) : posts;
  }, [filter, posts]);
  const postStats = useMemo(
    () => buildProjectPostStats(dateFilteredPosts),
    [dateFilteredPosts],
  );
  const { openEditDialogFromPost, dialog } = usePostDialog({
    slots: [],
    reload,
    setError: setDialogError,
  });
  const canCreatePosts = can("posts.create");
  const canShare = canGenerateShareLink(
    teamRole,
    teamMemberId,
    project?.manager_id,
  );

  if (isLoading) {
    return <DetailPageLoading backButton={<ProjectDetailBackButton />} />;
  }

  if (!project) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <ProjectDetailHeaderActions
              canCreatePosts={false}
              canShare={false}
              dateFilterProps={dateFilterProps}
            />
          }
        />
        <ErrorBanner message={error ?? "Project not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <ProjectDetailHeaderActions
            projectId={project.id}
            projectName={getProjectDisplayLabel(project)}
            canCreatePosts={canCreatePosts}
            canShare={canShare}
            dateFilterProps={dateFilterProps}
          />
        }
      />

      {error ? <ErrorBanner message={error} /> : null}
      {dialogError ? <ErrorBanner message={dialogError} /> : null}

      <ProjectProfileCard
        project={project}
        postStats={postStats}
        teamMembers={teamMembers}
      />

      <ProjectPostsTable
        posts={dateFilteredPosts}
        isLoading={isLoading}
        onEditPost={openEditDialogFromPost}
      />

      <PostDialog {...dialog} />
    </PageContent>
  );
}
