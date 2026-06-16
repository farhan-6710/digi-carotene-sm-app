import { SessionActivityGraph } from "@/features/analytics/components/SessionActivityGraph";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import { usePostsAnalyticsQuery } from "@/features/analytics/hooks/usePostsAnalyticsQuery";
import { StatsCards } from "@/shared/components/StatsCards";

export function PostsAnalyticsPanel() {
  const { stats, topClients, isLoading, error } = usePostsAnalyticsQuery();

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <StatsCards cards={stats} isLoading={isLoading} />
      <PostsTopClientsTable clients={topClients} isLoading={isLoading} />
      <SessionActivityGraph />
    </div>
  );
}
