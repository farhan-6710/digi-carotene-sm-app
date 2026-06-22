import { format, parseISO } from "date-fns";

import { PORTAL_POSTS_ROW_GRID_CLASS } from "@/features/portal/constants/postsDirectory";
import type { PortalPostsTableRowProps } from "@/features/portal/types/components";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { cn } from "@/shared/lib/utils";

function formatScheduled(post: PortalPostsTableRowProps["post"]): string {
  const dateLabel = format(parseISO(post.scheduled_date), "MMM d, yyyy");
  if (!post.scheduled_time) {
    return dateLabel;
  }
  return `${dateLabel} · ${post.scheduled_time}`;
}

export function PortalPostsTableRow({ post }: PortalPostsTableRowProps) {
  return (
    <div
      className={cn(
        "grid gap-2 px-6 py-4 sm:items-center sm:gap-4",
        PORTAL_POSTS_ROW_GRID_CLASS,
      )}
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
    </div>
  );
}
