import { FolderKanban } from "lucide-react";

import { organicPlatformLabel } from "@/features/growth-and-analytics/constants/growthPlatformConfig";
import type { GrowthPlatform } from "@/features/growth-and-analytics/types/types";

type GrowthPlatformComingSoonProps = {
  platform: GrowthPlatform;
  /** "dashboard" | "content" — tweaks the empty-state copy. */
  surface?: "dashboard" | "content";
};

export function GrowthPlatformComingSoon({
  platform,
  surface = "dashboard",
}: GrowthPlatformComingSoonProps) {
  const label = organicPlatformLabel(platform);
  const title =
    surface === "content"
      ? `${label} content performance coming soon`
      : `${label} account growth and analytics dashboard coming soon`;
  const description =
    surface === "content"
      ? `Post-level analytics for ${label} accounts are not available yet. Switch to an Instagram account to review content performance.`
      : `Metrics and charts for ${label} accounts are not available yet. Switch to an Instagram account to view the live dashboard.`;

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground">
        <FolderKanban className="size-5" aria-hidden="true" />
      </div>
      <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Coming soon
      </span>
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
