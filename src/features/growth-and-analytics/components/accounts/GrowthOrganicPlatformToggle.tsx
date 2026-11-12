import {
  FacebookIcon,
  InstagramIcon,
} from "@/shared/constants/socialIcons";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import type { GrowthOrganicPlatformToggleProps } from "../types/components";
import type { GrowthPlatform } from "../types/types";
import { organicPlatformLabel } from "../constants/growthPlatformConfig";

const PLATFORM_ORDER: GrowthPlatform[] = ["instagram", "facebook"];

const PLATFORM_ICON: Record<
  GrowthPlatform,
  typeof InstagramIcon
> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

export function GrowthOrganicPlatformToggle({
  value,
  onChange,
  availablePlatforms,
  className,
}: GrowthOrganicPlatformToggleProps) {
  const available = new Set(availablePlatforms);

  return (
    <div
      className={cn(
        "inline-flex shrink-0 gap-1 rounded-full border border-border bg-muted/30 p-1",
        className,
      )}
      role="group"
      aria-label="Organic platform"
    >
      {PLATFORM_ORDER.map((platform) => {
        const isActive = value === platform;
        const isEnabled = available.has(platform);
        const Icon = PLATFORM_ICON[platform];

        return (
          <Button
            key={platform}
            type="button"
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "h-8 gap-1.5 rounded-full px-3 text-xs",
              !isActive && "text-muted-foreground",
            )}
            aria-pressed={isActive}
            aria-label={organicPlatformLabel(platform)}
            disabled={!isEnabled}
            onClick={() => onChange(platform)}
          >
            <Icon className="size-3.5" aria-hidden />
            {organicPlatformLabel(platform)}
          </Button>
        );
      })}
    </div>
  );
}
