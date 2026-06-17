import { SessionActivityGraph } from "@/features/analytics/components/SessionActivityGraph";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import { usePostsAnalyticsQuery } from "@/features/analytics/hooks/usePostsAnalyticsQuery";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { StatsCards } from "@/shared/components/StatsCards";

export function PostsAnalyticsPanel() {
  const { stats, topClients, isLoading, error } = usePostsAnalyticsQuery();

  return (
    <div className="space-y-6">
      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={stats} isLoading={isLoading} />
      <PostsTopClientsTable clients={topClients} isLoading={isLoading} />
      <SessionActivityGraph />
    </div>
  );
}
