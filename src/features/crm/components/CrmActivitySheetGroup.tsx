import { ChevronDown } from "lucide-react";

import { CrmActivitySheetRow } from "@/features/crm/components/CrmActivitySheetRow";
import type { CrmActivitySheetGroupProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";

export function CrmActivitySheetGroup({
  label,
  count,
  expanded,
  onToggle,
  items,
  emptyMessage,
  onNavigate,
}: CrmActivitySheetGroupProps) {
  return (
    <div>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-1 py-2.5 text-left",
          "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
          "transition-colors hover:bg-muted/40 hover:text-foreground",
        )}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            !expanded && "-rotate-90",
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground normal-case tracking-normal">
          {count}
        </span>
      </button>
      {expanded ? (
        items.length === 0 ? (
          <p className="px-1 py-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((activity) => (
              <CrmActivitySheetRow
                key={activity.id}
                activity={activity}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
