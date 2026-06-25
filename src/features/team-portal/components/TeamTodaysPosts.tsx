import { TeamDashboardPostList } from "@/features/team-portal/components/TeamDashboardPostList";
import { useTeamDashboardPostStatusChange } from "@/features/team-portal/hooks/useTeamDashboardPostStatusChange";
import { useTeamTodaysPostsQuery } from "@/features/team-portal/hooks/useTeamTodaysPostsQuery";

export function TeamTodaysPosts() {
  const { items, isLoading, error, updateItemStatus } = useTeamTodaysPostsQuery();
  const { changeStatus, updatingPostId } = useTeamDashboardPostStatusChange();

  return (
    <TeamDashboardPostList
      title="Today's to be posted"
      items={items}
      isLoading={isLoading}
      error={error}
      emptyMessage="No posts to be posted today."
      updatingPostId={updatingPostId}
      onStatusChange={(postId, status) => {
        const item = items.find((row) => row.id === postId);
        if (!item) {
          return;
        }

        void changeStatus(postId, status, item.postStatus, updateItemStatus);
      }}
    />
  );
}
