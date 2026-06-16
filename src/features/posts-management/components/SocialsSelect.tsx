import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import {
  SOCIAL_PLATFORMS,
  type SocialPlatform,
} from "@/features/posts-management/constants/postsManagement";
import { cn } from "@/shared/lib/utils";
import type { SocialsSelectProps } from "@/features/posts-management/types/components";

export function SocialsSelect({
  value = [],
  onChange,
  disabled = false,
}: SocialsSelectProps) {
  const [open, setOpen] = useState(false);
  const safeValue = Array.isArray(value) ? value : [];

  const togglePlatform = (platform: SocialPlatform) => {
    if (safeValue.includes(platform)) {
      onChange(safeValue.filter((p) => p !== platform));
    } else {
      onChange([...safeValue, platform]);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-muted-foreground">
        Social Platforms
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40"
          >
            <span className="flex flex-wrap items-center gap-1.5">
              {safeValue.length === 0 ? (
                <span className="text-muted-foreground font-normal">Select platforms</span>
              ) : (
                safeValue.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs text-foreground font-medium border border-border"
                  >
                    <span>{platform}</span>
                  </span>
                ))
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) border-muted-foreground/10 p-2 shadow-xl"
          align="start"
        >
          <div className="flex flex-col gap-1">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isSelected = safeValue.includes(platform);

              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/60",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn(
                      "size-4 rounded border flex items-center justify-center transition-colors",
                      isSelected 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : "border-muted-foreground/40 bg-background"
                    )}>
                      {isSelected ? (
                        <Check className="size-2.5 stroke-[3.5]" />
                      ) : null}
                    </span>
                    <span className="text-foreground font-normal">{platform}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
