import { format, parseISO } from "date-fns";

import { CLIENT_POSTS_ROW_GRID_CLASS } from "@/features/client-portal/constants/postsDirectory";
import type { ClientPostsTableRowProps } from "@/features/client-portal/types/components";
import {
  statusBadgeStyles,
} from "@/features/posts-management/constants/postsManagement";
import { cn } from "@/shared/lib/utils";

function formatToBePostedOn(post: ClientPostsTableRowProps["post"]): string {
  const dateLabel = format(parseISO(post.to_be_posted_date), "MMM d, yyyy");
  if (!post.to_be_posted_time) {
    return dateLabel;
  }
  return `${dateLabel} · ${post.to_be_posted_time}`;
}

export function ClientPostsTableRow({ post }: ClientPostsTableRowProps) {
  return (
    <div
      className={cn(
        "grid gap-2 px-6 py-4 sm:items-center sm:gap-4",
        CLIENT_POSTS_ROW_GRID_CLASS,
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">
          {post.post_title?.trim() || "Untitled post"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
          {formatToBePostedOn(post)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {post.project_name ?? "—"}
      </p>
      <p className="hidden text-sm text-muted-foreground sm:block">
        {formatToBePostedOn(post)}
      </p>
      <p className="text-xs text-muted-foreground">
        {(post.socials ?? []).join(", ") || "—"}
      </p>
      <span
        className={[
          "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
          statusBadgeStyles[post.status],
        ].join(" ")}
      >
        {post.status}
      </span>
    </div>
  );
}
