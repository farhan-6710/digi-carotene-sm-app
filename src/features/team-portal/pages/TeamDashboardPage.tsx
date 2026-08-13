import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import { useAnalyticsFilters } from "@/features/analytics/hooks/useAnalyticsFilters";
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
  const { filter, dateFilterProps } = useAnalyticsFilters();
  const {
    statCards,
    topClients,
    todaysPosts,
    needsAttentionPosts,
    isStatsLoading,
    isSidebarPostsLoading,
    isPostsLoading,
    error,
    updateTodayPostStatus,
    removeNeedsAttentionPost,
  } = useTeamDashboardQuery(filter);
  const { changeStatus, updatingPostId } = useTeamDashboardPostStatusChange();

  return (
    <PageContent>
      <PageHeader
        heading="Dashboard"
        description="Agency overview — team workload, posts publishing comparison, and posts needing attention."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={statCards} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PageContent className="space-y-6 lg:col-span-2">
          <TeamPostingChart />
          <PostsTopClientsTable
            clients={topClients}
            isLoading={isPostsLoading}
            dateFilterProps={dateFilterProps}
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
            items={needsAttentionPosts}
            isLoading={isSidebarPostsLoading}
            error={error}
            updatingPostId={updatingPostId}
            onStatusChange={(postId, status) => {
              const item = needsAttentionPosts.find((row) => row.id === postId);
              if (!item) {
                return;
              }

              void changeStatus(
                postId,
                status,
                item.postStatus,
                (id, newStatus) => {
                  if (newStatus !== "Not posted") {
                    removeNeedsAttentionPost(id);
                  }
                },
              );
            }}
          />
        </PageContent>
      </div>
    </PageContent>
  );
}
