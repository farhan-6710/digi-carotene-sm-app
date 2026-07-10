import { Pencil } from "lucide-react";

import { PROJECT_POSTS_ROW_GRID_CLASS } from "@/features/projects-management/constants/projectPostsDirectory";
import type { ProjectPostsTableRowProps } from "@/features/projects-management/types/components";
import {
  formatPostedOnLabel,
  formatToBePostedOnLabel,
} from "@/features/projects-management/utils/projectPostDisplayUtils";
import {
  statusBadgeStyles,
} from "@/features/posts-management/constants/postsManagement";
import { cn } from "@/shared/lib/utils";

export function ProjectPostsTableRow({
  post,
  onEditPost,
}: ProjectPostsTableRowProps) {
  const toBePostedLabel = formatToBePostedOnLabel(
    post.to_be_posted_date,
    post.to_be_posted_time,
  );
  const postedLabel =
    post.status === "Posted"
      ? formatPostedOnLabel(post.posted_date, post.posted_time)
      : "—";

  return (
    <div
      className={cn(
        "grid gap-2 px-6 py-4 sm:items-center sm:gap-4",
        PROJECT_POSTS_ROW_GRID_CLASS,
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">
          {post.post_title?.trim() || "Untitled post"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
          {toBePostedLabel}
        </p>
      </div>
      <p className="hidden text-sm text-muted-foreground sm:block">{toBePostedLabel}</p>
      <p className="text-sm text-muted-foreground">{postedLabel}</p>
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
        <button
          type="button"
          onClick={() => onEditPost(post)}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit post</span>
        </button>
      </div>
    </div>
  );
}
