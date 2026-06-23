import {
  statusColors,
} from "@/features/posts-management/constants/postsManagement";
import type { StatusKey } from "@/features/posts-management/types/types";
import {
  postStatusFilterAllActiveStyle,
  postStatusFilterAllInactiveStyle,
  postStatusFilterActiveStyles,
  postStatusFilterInactiveStyles,
} from "@/shared/constants/postStatusFilterStyles";
import { cn } from "@/shared/lib/utils";
import {
  POST_STATUS_FILTER_ALL,
  type PostStatusFilterTarget,
} from "@/shared/utils/postStatusFilterUtils";

export type PostStatusFilterProps = {
  options: StatusKey[];
  showAll: boolean;
  activeStatuses: StatusKey[];
  onToggle: (target: PostStatusFilterTarget) => void;
  label?: string;
  className?: string;
};

export function PostStatusFilter({
  options,
  showAll,
  activeStatuses,
  onToggle,
  label = "Filter by status",
  className,
}: PostStatusFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2", className)}>
      <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/40 p-1"
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={() => onToggle(POST_STATUS_FILTER_ALL)}
          className={cn(
            "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition-all",
            showAll
              ? postStatusFilterAllActiveStyle
              : postStatusFilterAllInactiveStyle,
            !showAll && "hover:bg-muted/50 hover:text-muted-foreground",
          )}
          aria-pressed={showAll}
        >
          {POST_STATUS_FILTER_ALL}
        </button>

        {options.map((status) => {
          const isActive = !showAll && activeStatuses.includes(status);

          return (
            <button
              key={status}
              type="button"
              onClick={() => onToggle(status)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold transition-all",
                isActive
                  ? postStatusFilterActiveStyles[status]
                  : postStatusFilterInactiveStyles[status],
                !isActive && "hover:bg-muted/50 hover:text-muted-foreground",
              )}
              aria-pressed={isActive}
            >
              <span
                className={cn(
                  "rounded-full transition-all",
                  isActive ? "size-1.5 " + statusColors[status] : "size-1 bg-muted-foreground/35",
                )}
              />
              <span>{status}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
