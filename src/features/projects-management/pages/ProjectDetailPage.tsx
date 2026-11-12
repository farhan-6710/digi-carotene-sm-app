import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProjectChatSection } from "@/features/chat/components/ProjectChatSection";
import { useGrowthAccountsByClientId } from "@/features/growth-and-analytics/hooks/shared/useGrowthAccountsByClientId";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { buildAddPostsPath, buildPostDetailPath } from "@/features/posts-management/constants/routes";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { ProjectDialog } from "@/features/projects-management/components/ProjectDialog";
import { ProjectGrowthNavButtons } from "@/features/projects-management/components/ProjectGrowthNavButtons";
import { ProjectPostsTable } from "@/features/projects-management/components/ProjectPostsTable";
import { ProjectProfileCard } from "@/features/projects-management/components/ProjectProfileCard";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/projects-management/constants/routes";
import { useProjectDetailQuery } from "@/features/projects-management/hooks/useProjectDetailQuery";
import { useProjectDialog } from "@/features/projects-management/hooks/useProjectDialog";
import {
  buildProjectCampaignAnalyticsPath,
  buildProjectContentPerformancePath,
} from "@/features/projects-management/utils/projectGrowthPaths";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { buildProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";
import { ShareLinkButton } from "@/features/share/components/ShareLinkButton";

import { canGenerateShareLink } from "@/features/share/utils/shareAccess";
import { ProjectTasksSection } from "@/features/tasks-management/components/ProjectTasksSection";
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
import { navigateBackOrFallback } from "@/shared/utils/navigateBackOrFallback";

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
  canEditProject,
  editProjectLabel = "Edit Project",
  canShare,
  contentPerformanceHref,
  campaignAnalyticsHref,
  dateFilterProps,
  onEditProject,
}: {
  projectId?: string;
  canEditProject: boolean;
  editProjectLabel?: string;
  canShare: boolean;
  contentPerformanceHref?: string;
  campaignAnalyticsHref?: string;
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
            {editProjectLabel}
          </Button>
        ) : null}
        {projectId ? (
          <ShareLinkButton
            canShare={canShare}
            onCopy={() => copyProjectShareLink(projectId)}
          />
        ) : null}
        <ProjectGrowthNavButtons
          contentPerformanceHref={contentPerformanceHref}
          campaignAnalyticsHref={campaignAnalyticsHref}
        />
      </div>
      <DateFiltersTwo {...dateFilterProps} />
    </div>
  );
}

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    can,
    canFullyEditProject,
    canEditProjectSocials,
    seesAllProjects,
  } = usePermissions();
  const { teamRole, teamMemberId } = useAuth();
  const [dialogError, setDialogError] = useState<string | null>(null);
  const { project, posts, teamMembers, isLoading, error, reload } =
    useProjectDetailQuery(projectId);
  const { organic, ads, hasOrganic, hasAds } = useGrowthAccountsByClientId(
    project?.client_id,
  );
  const contentPerformanceHref = hasOrganic
    ? buildProjectContentPerformancePath("team", organic[0].id)
    : undefined;
  const campaignAnalyticsHref = hasAds
    ? buildProjectCampaignAnalyticsPath("team", ads[0].id)
    : undefined;
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
  const canReadPosts = can("posts.read");
  const canUpdatePosts = can("posts.update");
  const canReadTasks = can("tasks.read");
  const showProjectEdit = canEditProjectSocials;
  const socialsOnlyEdit = canEditProjectSocials && !canFullyEditProject;
  const canShare = canGenerateShareLink(
    teamRole,
    teamMemberId,
    project?.manager_id,
  );

  const canViewProject =
    !project ||
    seesAllProjects ||
    (teamMemberId != null &&
      (project.manager_id === teamMemberId ||
        (project.team_member_ids ?? []).includes(teamMemberId)));

  if (isLoading) {
    return <DetailPageLoading backButton={<ProjectDetailBackButton />} />;
  }

  if (!project || !canViewProject) {
    return (
      <section className="space-y-4">
        <PageHeader
          actions={
            <ProjectDetailHeaderActions
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
            canEditProject={showProjectEdit}
            editProjectLabel={
              socialsOnlyEdit ? "Edit social links" : "Edit Project"
            }
            canShare={canShare}
            contentPerformanceHref={contentPerformanceHref}
            campaignAnalyticsHref={campaignAnalyticsHref}
            dateFilterProps={dateFilterProps}
            onEditProject={() =>
              openEditDialog(project, { socialsOnly: socialsOnlyEdit })
            }
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

      {canReadPosts ? (
        <ProjectPostsTable
          posts={dateFilteredPosts}
          isLoading={isLoading}
          canDelete={can("posts.delete")}
          addPostHref={
            canCreatePosts
              ? buildAddPostsPath({
                  date: new Date(),
                  projectId: project.id,
                  projectName: getProjectDisplayLabel(project),
                  returnToProject: true,
                })
              : undefined
          }
          reload={reload}
          onOpenPost={(post) => navigate(buildPostDetailPath(post.id))}
          onEditPost={canUpdatePosts ? openEditDialogFromPost : undefined}
        />
      ) : null}

      {canReadTasks ? (
        <ProjectTasksSection projectId={project.id} projectKind="sm" />
      ) : null}

      <ProjectChatSection project={project} teamMembers={teamMembers} />

      {canUpdatePosts || canCreatePosts ? <PostDialog {...postDialog} /> : null}
      {showProjectEdit ? (
        <ProjectDialog
          {...projectDialog}
          onDelete={
            projectDialog.onDelete
              ? async () => {
                  await projectDialog.onDelete?.();
                  navigateBackOrFallback(
                    navigate,
                    location,
                    PROJECTS_MANAGEMENT_PATH,
                  );
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
