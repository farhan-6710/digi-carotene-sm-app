import { cn } from "@/shared/lib/utils";
import { Switch } from "@/shared/ui/switch";

type ActiveStatusSwitchFieldProps = {
  entityLabel: "client" | "project";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function ActiveStatusSwitchField({
  entityLabel,
  checked,
  onCheckedChange,
  disabled = false,
}: ActiveStatusSwitchFieldProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Status</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {checked
              ? `This ${entityLabel} is active and visible in pickers.`
              : `Inactive ${entityLabel}s stay in history but are hidden from pickers.`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5 text-muted-foreground">
          <span
            className={cn(
              "text-xs font-semibold",
              !checked && "text-foreground",
            )}
          >
            Inactive
          </span>
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-label={`Toggle ${entityLabel} active status`}
            className="cursor-pointer"
          />
          <span
            className={cn(
              "text-xs font-semibold",
              checked && "text-foreground",
            )}
          >
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActiveStatusLabel({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "text-sm font-medium",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
