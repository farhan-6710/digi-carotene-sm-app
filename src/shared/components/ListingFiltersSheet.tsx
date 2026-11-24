import type { ReactNode } from "react";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

type ListingFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Optional Clear / Apply row. Defaults to a Close button. */
  footer?: ReactNode;
};

/**
 * Mobile filter panel (Sheet). Pair with `ListingFiltersChrome`:
 * desktop keeps filters inline (`md+`); below `md` one Filters button opens this sheet.
 * Live-updating controlled filters are fine — Close when done.
 */
export function ListingFiltersSheet({
  open,
  onOpenChange,
  title = "Filters",
  description = "Narrow this list. Changes apply immediately.",
  children,
  footer,
}: ListingFiltersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[85vh] w-full flex-col gap-0 p-0 sm:max-w-none"
      >
        <SheetHeader className="border-b border-border pr-12 text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
          {children}
        </div>

        <SheetFooter className="border-t border-border sm:flex-row sm:justify-end">
          {footer ?? (
            <Button
              type="button"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
