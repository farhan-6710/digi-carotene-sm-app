import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { CONTACTS_ROW_GRID_CLASS } from "@/features/crm/constants/contactsDirectory";
import type { ContactsTableRowProps } from "@/features/crm/types/components";
import { cn } from "@/shared/lib/utils";

export function ContactsTableRow({ contact }: ContactsTableRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        CONTACTS_ROW_GRID_CLASS,
      )}
    >
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          NAME
        </span>
        {contact.name}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          COMPANY
        </span>
        {contact.company || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          EMAIL
        </span>
        <span className="block truncate">
          {contact.email || (
            <span className="text-muted-foreground/50">—</span>
          )}
        </span>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PHONE
        </span>
        {contact.phone || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          INDUSTRY
        </span>
        {contact.industry || (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          SOURCE
        </span>
        {LEAD_SOURCE_LABELS[contact.lead_source]}
      </div>
    </div>
  );
}
