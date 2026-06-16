import { legendItems } from "@/features/analytics/constants/sessionActivity";

export function SessionActivityLegend() {
  return (
    <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
      <span>Less</span>
      <div className="flex items-center gap-1">
        {legendItems.map((item) => (
          <span
            key={item.level}
            className={`size-[11px] rounded-sm ${item.className}`}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}
