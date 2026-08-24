import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { CONVERSIONS_ROW_GRID_CLASS } from "@/features/crm/constants/conversionsDirectory";
import type { ConversionsTableRowProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";

export function ConversionsTableRow({ conversion }: ConversionsTableRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        CONVERSIONS_ROW_GRID_CLASS,
      )}
    >
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          NAME
        </span>
        {conversion.name}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          COMPANY
        </span>
        {conversion.company || (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          EMAIL
        </span>
        <span className="block truncate">
          {conversion.email || (
            <span className="text-muted-foreground/50">—</span>
          )}
        </span>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PHONE
        </span>
        {conversion.phone || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          INDUSTRY
        </span>
        {conversion.industry || (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SOURCE
        </span>
        {LEAD_SOURCE_LABELS[conversion.lead_source]}
      </div>
    </div>
  );
}
