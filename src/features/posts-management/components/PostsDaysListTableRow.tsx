import { POSTS_DAYS_LIST_ROW_GRID_CLASS } from "@/features/posts-management/constants/postsDaysListDirectory";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import type { PostsDaysListTableRowProps } from "@/features/posts-management/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { cn } from "@/shared/lib/utils";

export function PostsDaysListTableRow({
  date,
  dayLabel,
  postCount,
  statusMix,
  href,
}: PostsDaysListTableRowProps) {
  return (
    <DirectoryTableRow
      to={href}
      className={cn(
        "grid grid-cols-1 items-center gap-2 px-4 py-3 sm:items-center sm:gap-4 sm:px-6 sm:py-4",
        POSTS_DAYS_LIST_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          DAY
        </span>
        <p className="text-sm font-semibold text-foreground">{date}</p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          WEEKDAY
        </span>
        <p className="truncate text-sm text-muted-foreground">{dayLabel}</p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          POSTS
        </span>
        <p className="text-sm text-muted-foreground">
          {postCount === 0
            ? "No posts"
            : `${postCount} post${postCount === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS MIX
        </span>
        {statusMix.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm font-semibold">
            {statusMix.map((item, index) => (
              <span key={item.status} className="contents">
                {index > 0 ? (
                  <span className="font-normal text-muted-foreground">·</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      statusColors[item.status],
                    )}
                    aria-hidden
                  />
                  <span className={statusText[item.status]}>
                    {item.count} {item.status}
                  </span>
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </DirectoryTableRow>
  );
}
