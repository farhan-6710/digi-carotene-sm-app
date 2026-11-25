import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import type { AdAccountKind, GrowthPlatform } from "../../types/types";
import { adAccountKindLabel } from "../../constants/shared/growthPlatformConfig";

/** Labels come from the table header; kept for call-site compatibility. */
export function MobileLabel({ children: _children }: { children: ReactNode }) {
  void _children;
  return null;
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

export function AdsPlatformBadge({ platform }: { platform: AdAccountKind }) {
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
      {adAccountKindLabel(platform)}
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
