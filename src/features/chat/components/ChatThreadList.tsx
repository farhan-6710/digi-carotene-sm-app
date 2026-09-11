import { X } from "lucide-react";
import { Link } from "react-router";

import type { ChatThreadListProps } from "@/features/chat/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ChatThreadList({
  items,
  emptyMessage,
  isLoading = false,
  onNavigate,
  onDismissRequest,
}: ChatThreadListProps) {
  if (isLoading) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        Loading chats…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => (
        <li key={item.id} className="flex items-stretch gap-1 pr-1">
          <Link
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "min-w-0 flex-1 px-4 py-3 transition hover:bg-secondary/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              {item.meta ? (
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {item.meta}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {item.preview}
            </p>
          </Link>
          {onDismissRequest ? (
            <div className="flex shrink-0 items-center pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${item.title} from chats`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDismissRequest(item.id);
                }}
              >
                <X className="size-3.5" aria-hidden />
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
