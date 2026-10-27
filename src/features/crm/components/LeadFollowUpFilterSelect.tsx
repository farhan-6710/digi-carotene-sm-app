import { Check, ChevronDown, CalendarClock } from "lucide-react";

import {
  LEAD_FOLLOW_UP_FILTER_LABELS,
  LEAD_FOLLOW_UP_FILTERS,
  type LeadFollowUpFilterId,
} from "@/features/crm/constants/leadFollowUpFilters";
import type { LeadFollowUpFilterSelectProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function LeadFollowUpFilterSelect({
  value,
  onChange,
  disabled = false,
}: LeadFollowUpFilterSelectProps) {
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
            aria-label={`Follow-ups: ${LEAD_FOLLOW_UP_FILTER_LABELS[value]}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <CalendarClock
                className="size-3.5 shrink-0 opacity-70"
                aria-hidden="true"
              />
              <span className="truncate">
                {LEAD_FOLLOW_UP_FILTER_LABELS[value]}
              </span>
            </span>
            <ChevronDown
              className="size-3.5 shrink-0 opacity-70"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          {LEAD_FOLLOW_UP_FILTERS.map((filter) => (
            <DropdownMenuItem
              key={filter}
              onSelect={() => onChange(filter as LeadFollowUpFilterId)}
              className="flex items-center justify-between gap-2"
            >
              <span>{LEAD_FOLLOW_UP_FILTER_LABELS[filter]}</span>
              {value === filter ? (
                <Check className="size-3.5 shrink-0 text-primary" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
