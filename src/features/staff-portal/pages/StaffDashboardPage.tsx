import { AdminNeedsAttention } from "@/features/admin-dashboard/components/AdminNeedsAttention";
import { AdminPostingChart } from "@/features/admin-dashboard/components/AdminPostingChart";
import { useAdminDashboardQuery } from "@/features/admin-dashboard/hooks/useAdminDashboardQuery";
import { PostsTopClientsTable } from "@/features/analytics/components/PostsTopClientsTable";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";

export function AdminDashboardPage() {
  const { statCards, topClients, isStatsLoading, isPostsLoading, error } =
    useAdminDashboardQuery();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Dashboard"
        description="Real-time operations, team workload, and publishing performance."
      />

      {error ? <ErrorBanner message={error} /> : null}

      <StatsCards cards={statCards} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminPostingChart />
          <PostsTopClientsTable clients={topClients} isLoading={isPostsLoading} />
        </div>

        <div className="lg:col-span-1">
          <AdminNeedsAttention />
        </div>
      </div>
    </section>
  );
}
