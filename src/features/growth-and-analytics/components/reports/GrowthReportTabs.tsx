import { reportTabs } from "../constants/reportsData";
import type { GrowthReportTabsProps } from "../types/components";
import { cn } from "@/shared/lib/utils";

export function GrowthReportTabs({
  activeType,
  onTypeChange,
}: GrowthReportTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {reportTabs.map((tab) => {
        const isActive = tab.id === activeType;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTypeChange(tab.id)}
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
