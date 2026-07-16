import { Plus, Trash2 } from "lucide-react";

import type { AddPostsDayListProps } from "@/features/posts-management/types/components";
import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function AddPostsDayList({
  drafts,
  activeDayId,
  disabled = false,
  onSelectDay,
  onAddDay,
  onRequestRemoveDay,
}: AddPostsDayListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Posts
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onAddDay}
          disabled={disabled}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add post
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {drafts.map((draft, index) => {
          const schedule = draft.values.toBePostedOn;
          const label = schedule
            ? formatPostScheduleLabel(
                schedule.year,
                schedule.month,
                schedule.day,
                schedule.time || "—",
              )
            : `Post ${index + 1}`;
          const title = draft.values.postTitle.trim() || "Untitled post";
          const isActive = draft.id === activeDayId;

          return (
            <div
              key={draft.id}
              className={cn(
                "flex items-stretch gap-1 rounded-xl border transition",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-muted/40",
              )}
            >
              <button
                type="button"
                onClick={() => onSelectDay(draft.id)}
                disabled={disabled}
                className="min-w-0 flex-1 px-3 py-2.5 text-left"
              >
                <span className="block truncate text-sm font-medium text-foreground">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {label}
                </span>
              </button>

              {drafts.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="m-1 size-8 shrink-0 rounded-lg text-muted-foreground"
                  onClick={() => onRequestRemoveDay(draft.id)}
                  disabled={disabled}
                  aria-label={`Remove post ${index + 1}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
