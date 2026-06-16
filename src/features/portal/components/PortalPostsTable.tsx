import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

import type { Post } from "@/features/posts-management/types/types";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import type { PortalPostsTableProps } from "@/features/portal/types/components";

function formatScheduled(post: Post): string {
  const dateLabel = format(parseISO(post.scheduled_date), "MMM d, yyyy");
  if (!post.scheduled_time) {
    return dateLabel;
  }
  return `${dateLabel} · ${post.scheduled_time}`;
}

export function PortalPostsTable({ posts, isLoading }: PortalPostsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No posts scheduled for your brand yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <div className="hidden sm:grid sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr] gap-3 border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Title</span>
        <span>Scheduled</span>
        <span>Platforms</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-border">
        {posts.map((post) => (
          <li
            key={post.id}
            className="grid gap-2 px-4 py-4 sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr] sm:items-center sm:gap-3"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {post.post_title?.trim() || "Untitled post"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                {formatScheduled(post)}
              </p>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">
              {formatScheduled(post)}
            </p>
            <p className="text-xs text-muted-foreground">
              {(post.socials ?? []).join(", ") || "—"}
            </p>
            <span
              className={[
                "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                statusColors[post.status],
                statusText[post.status],
              ].join(" ")}
            >
              {post.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
