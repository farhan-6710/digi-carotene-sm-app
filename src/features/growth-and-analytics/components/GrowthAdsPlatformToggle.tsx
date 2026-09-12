import { FacebookIcon, GoogleIcon } from "@/shared/constants/socialIcons";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import {
  adsAccountKindLabel,
  isAdsAccountKindReady,
} from "../constants/growthPlatformConfig";
import type { GrowthAdsPlatformToggleProps } from "../types/components";
import type { AdsAccountKind } from "../types/types";

const PLATFORM_ORDER: AdsAccountKind[] = ["meta_ads", "google_ads"];

const PLATFORM_ICON: Record<AdsAccountKind, typeof FacebookIcon> = {
  meta_ads: FacebookIcon,
  google_ads: GoogleIcon,
};

export function GrowthAdsPlatformToggle({
  value,
  onChange,
  availablePlatforms,
  /** When set, only listed kinds are clickable (Campaign Analytics). */
  disableUnavailable = false,
  className,
}: GrowthAdsPlatformToggleProps) {
  const available = availablePlatforms
    ? new Set(availablePlatforms)
    : null;

  return (
    <div
      className={cn(
        "inline-flex shrink-0 gap-1 rounded-full border border-border bg-muted/30 p-1",
        className,
      )}
      role="group"
      aria-label="Ads platform"
    >
      {PLATFORM_ORDER.map((platform) => {
        const isActive = value === platform;
        const isReady = isAdsAccountKindReady(platform);
        const isInAvailable = available ? available.has(platform) : true;
        const isEnabled = disableUnavailable
          ? isReady && isInAvailable
          : isReady;
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
            aria-label={adsAccountKindLabel(platform)}
            disabled={!isEnabled}
            onClick={() => onChange(platform)}
          >
            <Icon className="size-3.5" aria-hidden />
            {adsAccountKindLabel(platform)}
          </Button>
        );
      })}
    </div>
  );
}
