import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { buildAddPostsPath } from "@/features/posts-management/constants/routes";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { ProjectDialog } from "@/features/projects-management/components/ProjectDialog";
import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";
import { useProjectDetailQuery } from "@/features/projects-management/hooks/useProjectDetailQuery";
import { useProjectDialog } from "@/features/projects-management/hooks/useProjectDialog";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { ShareLinkButton } from "@/features/share/components/ShareLinkButton";
import { canGenerateShareLink } from "@/features/share/utils/shareAccess";
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
  canEditProject,
  canShare,
  dateFilterProps,
  onEditProject,
}: {
  projectId?: string;
  projectName?: string;
  canCreatePosts: boolean;
  canEditProject: boolean;
  canShare: boolean;
  dateFilterProps: DateFiltersTwoProps;
  onEditProject?: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <ProjectDetailBackButton />
        {canEditProject && onEditProject ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onEditProject}
          >
            <Pencil className="mr-2 size-4" />
            Edit Project
          </Button>
        ) : null}
        {canCreatePosts && projectId && projectName ? (
          <Button asChild className="rounded-full shadow-sm">
            <Link
              to={buildAddPostsPath({
                date: new Date(),
                projectId,
                projectName,
                returnToProject: true,
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
  const navigate = useNavigate();
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
  const { openEditDialogFromPost, dialog: postDialog } = usePostDialog({
    slots: [],
    reload,
    setError: setDialogError,
  });
  const { openEditDialog, dialog: projectDialog } = useProjectDialog({
    reload,
    setError: setDialogError,
  });
  const canCreatePosts = can("posts.create");
  const canEditProject = can("projects.update");
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
              canEditProject={false}
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
            canEditProject={canEditProject}
            canShare={canShare}
            dateFilterProps={dateFilterProps}
            onEditProject={() => openEditDialog(project)}
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

      <PostDialog {...postDialog} />
      {canEditProject ? (
        <ProjectDialog
          {...projectDialog}
          onDelete={
            projectDialog.onDelete
              ? async () => {
                  await projectDialog.onDelete?.();
                  void navigate(PROJECTS_MANAGEMENT_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
