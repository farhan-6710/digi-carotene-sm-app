import { ANALYTICS_TABS } from "@/features/analytics/constants/analyticsTabs";
import type { AnalyticsTabNavProps } from "@/features/analytics/types/components";
import { cn } from "@/shared/lib/utils";

export function AnalyticsTabNav({ activeTab, onTabChange }: AnalyticsTabNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {ANALYTICS_TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
