import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

import { PortalPageHeader } from "@/features/portal/components/PortalPageHeader";
import { PortalSocialLinks } from "@/features/portal/components/PortalSocialLinks";
import { usePortalClient } from "@/features/portal/providers/PortalClientProvider";
import {
  buildPortalStats,
  getUpcomingPosts,
} from "@/features/portal/utils/portalStats";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";

export function PortalDashboardPage() {
  const { client, posts, loading, error } = usePortalClient();
  const stats = buildPortalStats(posts);
  const upcoming = getUpcomingPosts(posts);

  if (error && !loading) {
    return (
      <section className="space-y-6">
        <PortalPageHeader
          title="Digi Carotene"
          highlight="Client Portal"
          description="We could not load your brand data."
        />
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PortalPageHeader
        title={client?.client_name ?? "Your brand"}
        highlight="Portal"
        description="Overview of your content schedule and account details with Digi Carotene."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 shadow-xs"
          >
            <div className="text-xs font-semibold tracking-wider text-muted-foreground">
              {stat.label.toUpperCase()}
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {loading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Upcoming posts
            </h2>
            <Link
              to="/portal/posts"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-xs">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
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
                        {format(parseISO(post.scheduled_date), "MMM d, yyyy")}
                        {post.scheduled_time
                          ? ` · ${post.scheduled_time}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusColors[post.status],
                        statusText[post.status],
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
          <h2 className="text-lg font-semibold tracking-tight">
            Social profiles
          </h2>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            {loading || !client ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <PortalSocialLinks client={client} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
