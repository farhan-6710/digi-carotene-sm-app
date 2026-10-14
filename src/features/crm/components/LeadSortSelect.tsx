import { ArrowUpDown, Check, ChevronDown } from "lucide-react";

import {
  LEAD_SORT_LABELS,
  LEAD_SORTS,
  type LeadSortId,
} from "@/features/crm/constants/leadSort";
import type { LeadSortSelectProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function LeadSortSelect({
  value,
  onChange,
  disabled = false,
}: LeadSortSelectProps) {
  return (
    <div className="w-full min-w-0 sm:w-[180px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-between gap-2 rounded-md border-input bg-transparent px-3 text-sm font-normal shadow-xs",
            )}
            aria-label={`Sort by: ${LEAD_SORT_LABELS[value]}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <ArrowUpDown
                className="size-3.5 shrink-0 opacity-70"
                aria-hidden="true"
              />
              <span className="truncate">{LEAD_SORT_LABELS[value]}</span>
            </span>
            <ChevronDown
              className="size-3.5 shrink-0 opacity-70"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          {LEAD_SORTS.map((sort) => (
            <DropdownMenuItem
              key={sort}
              onSelect={() => onChange(sort as LeadSortId)}
              className="flex items-center justify-between gap-2"
            >
              <span>{LEAD_SORT_LABELS[sort]}</span>
              {value === sort ? (
                <Check className="size-3.5 shrink-0 text-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
