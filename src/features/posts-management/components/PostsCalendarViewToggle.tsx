import { CalendarDays, List } from "lucide-react";

import type { PostsCalendarViewToggleProps } from "@/features/posts-management/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function PostsCalendarViewToggle({
  listView,
  onListViewChange,
}: PostsCalendarViewToggleProps) {
  return (
    <div
      className="inline-flex gap-1 rounded-full border border-border bg-muted/30 p-1"
      role="group"
      aria-label="Calendar view mode"
    >
      <Button
        type="button"
        size="sm"
        variant={listView ? "ghost" : "default"}
        className={cn(
          "h-8 gap-1.5 rounded-full px-3 text-xs",
          listView && "text-muted-foreground",
        )}
        aria-pressed={!listView}
        onClick={() => onListViewChange(false)}
      >
        <CalendarDays className="size-3.5" aria-hidden />
        Calendar
      </Button>
      <Button
        type="button"
        size="sm"
        variant={listView ? "default" : "ghost"}
        className={cn(
          "h-8 gap-1.5 rounded-full px-3 text-xs",
          !listView && "text-muted-foreground",
        )}
        aria-pressed={listView}
        onClick={() => onListViewChange(true)}
      >
        <List className="size-3.5" aria-hidden />
        List
      </Button>
    </div>
  );
}
