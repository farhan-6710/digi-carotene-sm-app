import { FolderKanban } from "lucide-react";

import { adsAccountKindLabel } from "@/features/growth-and-analytics/constants/growthPlatformConfig";
import type { AdsAccountKind } from "@/features/growth-and-analytics/types/types";

type GrowthAdsAnalyticsComingSoonProps = {
  platform: AdsAccountKind;
};

export function GrowthAdsAnalyticsComingSoon({
  platform,
}: GrowthAdsAnalyticsComingSoonProps) {
  const label = adsAccountKindLabel(platform);

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
          {label} campaign analytics coming soon
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Account is connected. Spend, clicks, and conversions for {label} Ads
          use a different API shape than Meta — reporting UI ships in the next
          pass. Switch to a Meta ad account for live campaign analytics.
        </p>
      </div>
    </div>
  );
}
