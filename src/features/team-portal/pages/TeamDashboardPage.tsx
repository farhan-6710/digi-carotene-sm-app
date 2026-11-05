import { ProjectCommitmentsTable } from "@/features/projects-management/components/ProjectCommitmentsTable";
import { PROJECT_COMMITMENTS_PATH } from "@/features/projects-management/constants/projectCommitments";
import { DateFiltersTwo } from "@/shared/components/DateFiltersTwo";
import { useDateFiltersTwo } from "@/shared/hooks/useDateFiltersTwo";
import { TeamMyTodosCard } from "@/features/team-portal/components/TeamMyTodosCard";
import { TeamNeedsAttention } from "@/features/team-portal/components/TeamNeedsAttention";
import { TeamTodaysPosts } from "@/features/team-portal/components/TeamTodaysPosts";
import { TeamPostingChart } from "@/features/team-portal/components/TeamPostingChart";
import { useTeamDashboardPostStatusChange } from "@/features/team-portal/hooks/useTeamDashboardPostStatusChange";
import { useTeamDashboardQuery } from "@/features/team-portal/hooks/useTeamDashboardQuery";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";

export function TeamDashboardPage() {
  const { filter, dateFilterProps } = useDateFiltersTwo();
  const {
    statCards,
    projectCommitments,
    todaysPosts,
    needsAttentionItems,
    isStatsLoading,
    isSidebarPostsLoading,
    isPostsLoading,
    error,
    updateTodayPostStatus,
  } = useTeamDashboardQuery(filter);
  const { changeStatus, updatingPostId } = useTeamDashboardPostStatusChange();

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard"
        description="Agency overview — team workload, posts publishing comparison, and posts needing attention."
        actions={<DateFiltersTwo {...dateFilterProps} />}
      />

      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={statCards} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PageContent className="space-y-6 lg:col-span-2">
          <TeamPostingChart />
          <ProjectCommitmentsTable
            rows={projectCommitments}
            isLoading={isPostsLoading}
            dateFilterProps={dateFilterProps}
            viewAllPath={PROJECT_COMMITMENTS_PATH}
            paginated={false}
            title="Project commitments"
            description="Top projects by committed content volume."
          />
        </PageContent>

        <PageContent className="space-y-6 lg:col-span-1">
          <TeamTodaysPosts
            items={todaysPosts}
            isLoading={isSidebarPostsLoading}
            error={error}
            updatingPostId={updatingPostId}
            onStatusChange={(postId, status) => {
              const item = todaysPosts.find((row) => row.id === postId);
              if (!item) {
                return;
              }

              void changeStatus(
                postId,
                status,
                item.postStatus,
                updateTodayPostStatus,
              );
            }}
          />
          <TeamNeedsAttention
            items={needsAttentionItems}
            isLoading={isSidebarPostsLoading}
            error={error}
          />
          <TeamMyTodosCard />
        </PageContent>
      </div>
    </PageContent>
  );
}
