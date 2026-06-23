import { format, parseISO } from "date-fns";
import { Link } from "react-router";

import { ClientSocialLinks } from "@/features/client-portal/components/ClientSocialLinks";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import {
  buildClientStatCards,
  getUpcomingPosts,
} from "@/features/client-portal/utils/clientStats";
import {
  statusBadgeStyles,
} from "@/features/posts-management/constants/postsManagement";
import { PageShell } from "@/shared/components/PageShell";
import { LoadingSpinner, TableLoadingState } from "@/shared/components/LoadingSpinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";

export function ClientDashboardPage() {
  const { client, projects, posts, loading, error } = useClientPortal();
  const statCards = buildClientStatCards(posts);
  const upcoming = getUpcomingPosts(posts);

  return (
    <PageShell
      heading={client?.client_name ?? "Your brand"}
      description="Overview of your content schedule, social profiles, and Digi Carotene account."
      error={error && !loading ? error : null}
    >
      <StatsCards cards={statCards} isLoading={loading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PageHeader
            heading="Upcoming posts"
            actions={
              <Link
                to="/client-portal/posts"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            }
          />

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {loading ? (
              <TableLoadingState minHeight={200} />
            ) : upcoming.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                No upcoming posts on the calendar.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {post.post_title?.trim() || "Untitled post"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(post.to_be_posted_date), "MMM d, yyyy")}
                        {post.to_be_posted_time ? ` · ${post.to_be_posted_time}` : ""}
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusBadgeStyles[post.status],
                      ].join(" ")}
                    >
                      {post.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PageHeader heading="Social profiles" />

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {loading || !client ? (
              <LoadingSpinner />
            ) : (
              <ClientSocialLinks projects={projects} />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
