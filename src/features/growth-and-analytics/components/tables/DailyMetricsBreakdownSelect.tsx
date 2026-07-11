import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { campaignDemographicBreakdownOptions } from "../../constants/campaignDemographicBreakdown";
import type { DailyMetricsBreakdownSelectProps } from "../../types/components";

export function DailyMetricsBreakdownSelect({
  value,
  onChange,
  emptyLabel = "Daily totals",
}: DailyMetricsBreakdownSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabels = campaignDemographicBreakdownOptions
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const triggerLabel =
    selectedLabels.length > 0 ? selectedLabels.join(" & ") : emptyLabel;

  const toggle = (option: (typeof campaignDemographicBreakdownOptions)[number]) => {
    const isSelected = value.includes(option.value);

    if (isSelected) {
      onChange(value.filter((item) => item !== option.value));
      return;
    }

    // Exclusive breakdowns (placement) replace everything; picking a
    // non-exclusive one drops any exclusive selection.
    if (option.exclusive) {
      onChange([option.value]);
      return;
    }

    const withoutExclusive = value.filter(
      (item) =>
        !campaignDemographicBreakdownOptions.find(
          (candidate) => candidate.value === item,
        )?.exclusive,
    );
    onChange([...withoutExclusive, option.value]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <span className="text-muted-foreground">Breakdown:</span>
          <span className="font-medium">{triggerLabel}</span>
          <ChevronDown
            className={cn("size-4 opacity-60 transition-transform", open && "rotate-180")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1.5">
        {campaignDemographicBreakdownOptions.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option)}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-secondary"
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded border border-input transition-colors",
                  isSelected && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {isSelected ? <Check className="size-3" /> : null}
              </span>
              {option.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
