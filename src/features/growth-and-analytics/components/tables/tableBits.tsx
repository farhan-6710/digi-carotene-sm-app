import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import type { AdsAccountKind, GrowthPlatform } from "../../types/types";
import { adsAccountKindLabel } from "../../constants/growthPlatformConfig";

export function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
      {children}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: GrowthPlatform }) {
  const isInstagram = platform === "instagram";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isInstagram
          ? "bg-accent/10 text-accent"
          : "bg-primary/10 text-primary",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isInstagram ? "bg-accent" : "bg-primary",
        )}
        aria-hidden="true"
      />
      {isInstagram ? "Instagram" : "Facebook"}
    </span>
  );
}

export function AdsPlatformBadge({ platform }: { platform: AdsAccountKind }) {
  const isMeta = platform === "meta_ads";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isMeta ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isMeta ? "bg-primary" : "bg-accent",
        )}
        aria-hidden="true"
      />
      {adsAccountKindLabel(platform)}
    </span>
  );
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  Active: "bg-status-posted/15 text-status-posted",
  Paused: "bg-status-scheduled/15 text-status-scheduled",
  Completed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_BADGE_CLASS[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}
