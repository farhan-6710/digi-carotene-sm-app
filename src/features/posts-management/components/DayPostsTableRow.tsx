import { ChevronRight } from "lucide-react";

import { DAY_POSTS_ROW_GRID_CLASS } from "@/features/posts-management/constants/dayPostsDirectory";
import { statusBadgeStyles } from "@/features/posts-management/constants/postsManagement";
import type { DayPostsTableRowProps } from "@/features/posts-management/types/components";
import { cn } from "@/shared/lib/utils";

export function DayPostsTableRow({ post, onOpenPost }: DayPostsTableRowProps) {
  const projectName = post.project_name?.trim() || "Unknown project";
  const projectLabel = post.client_name?.trim()
    ? `${projectName} (${post.client_name.trim()})`
    : projectName;

  return (
    <button
      type="button"
      onClick={() => onOpenPost(post)}
      className={cn(
        "grid w-full gap-2 px-6 py-4 text-left transition-colors hover:bg-muted/40 sm:items-center sm:gap-4",
        DAY_POSTS_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {projectLabel}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
          {post.to_be_posted_time}
        </p>
      </div>
      <p className="truncate text-sm text-muted-foreground">
        {post.post_title?.trim() || "Untitled post"}
      </p>
      <p className="hidden font-mono text-sm text-muted-foreground sm:block">
        {post.to_be_posted_time}
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
      <div className="flex justify-end">
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">View post details</span>
      </div>
    </button>
  );
}
