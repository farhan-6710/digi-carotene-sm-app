import { TEAM_WORK_SHEET_TAB_LABELS } from "@/features/team-portal/constants/teamWorkSheet";
import type { TeamWorkSheetTabBarProps } from "@/features/team-portal/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TeamWorkSheetTabBar({
  tabs,
  value,
  onChange,
}: TeamWorkSheetTabBarProps) {
  return (
    <div className="flex gap-1 rounded-full border border-border bg-muted/30 p-1">
      {tabs.map((tab) => (
        <Button
          key={tab}
          type="button"
          size="sm"
          variant={value === tab ? "default" : "ghost"}
          className={cn(
            "h-8 flex-1 rounded-full px-3 text-xs",
            value !== tab && "text-muted-foreground",
          )}
          onClick={() => onChange(tab)}
        >
          {TEAM_WORK_SHEET_TAB_LABELS[tab]}
        </Button>
      ))}
    </div>
  );
}
