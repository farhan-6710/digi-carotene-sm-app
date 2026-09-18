import { useState, type MouseEvent } from "react";

import { cn } from "@/shared/lib/utils";
import type { DirectoryTableColumn } from "@/shared/types/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

type DirectoryTableHeaderCellProps = {
  column: DirectoryTableColumn;
  index: number;
  divided: boolean;
  truncate: boolean;
  canReorder: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMove?: (direction: "left" | "right") => void;
};

/**
 * Header cell with full-name tooltip.
 * Reorderable columns: open menu via click, keyboard, or context menu
 * (right-click / trackpad two-finger tap).
 */
export function DirectoryTableHeaderCell({
  column,
  index,
  divided,
  truncate,
  canReorder,
  canMoveLeft,
  canMoveRight,
  onMove,
}: DirectoryTableHeaderCellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fullName = column.title ?? column.label;

  const cellClass = cn(
    "min-w-0",
    column.align === "right" ? "text-right" : undefined,
    divided
      ? cn("py-3 pr-4 relative", index === 0 ? "pl-0" : "pl-4")
      : undefined,
  );

  const labelClass = cn(truncate && "block truncate");

  const openFromContextMenu = (event: MouseEvent) => {
    if (!canReorder) return;
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(true);
  };

  if (!canReorder) {
    return (
      <div className={cellClass}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(labelClass, "inline-block max-w-full")}>
              {column.label}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">{fullName}</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={cellClass}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "max-w-full rounded-sm text-left text-xs font-semibold tracking-wider text-muted-foreground",
                  "outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                  column.align === "right" && "ml-auto text-right",
                  labelClass,
                )}
                aria-haspopup="menu"
                aria-label={`${fullName}. Open column menu to reorder`}
                onContextMenu={openFromContextMenu}
              >
                {column.label}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">{fullName}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuItem
            disabled={!canMoveLeft}
            onSelect={() => onMove?.("left")}
          >
            Move left
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canMoveRight}
            onSelect={() => onMove?.("right")}
          >
            Move right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
