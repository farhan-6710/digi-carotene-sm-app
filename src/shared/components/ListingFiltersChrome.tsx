import { useState, type ReactNode } from "react";
import { ListFilter } from "lucide-react";

import { ListingFiltersSheet } from "@/shared/components/ListingFiltersSheet";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ListingFiltersChromeProps = {
  children: ReactNode;
  /** Shown on the mobile Filters button when > 0. */
  activeCount?: number;
  title?: string;
  description?: string;
  className?: string;
  /** Extra controls always visible on mobile (e.g. bulk bar) — rendered before Filters. */
  leading?: ReactNode;
  footer?: ReactNode;
};

/**
 * Desktop (`md+`): filters inline.
 * Mobile: Filters button → ListingFiltersSheet.
 * Pass the same controlled filter controls as `children` (rendered twice; state stays on parent).
 */
export function ListingFiltersChrome({
  children,
  activeCount = 0,
  title = "Filters",
  description,
  className,
  leading,
  footer,
}: ListingFiltersChromeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center",
        className,
      )}
    >
      {leading}

      <div className="hidden min-w-0 flex-wrap items-center gap-2 md:flex">
        {children}
      </div>

      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          <ListFilter className="size-4" />
          Filters
          {activeCount > 0 ? (
            <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
        <ListingFiltersSheet
          open={open}
          onOpenChange={setOpen}
          title={title}
          description={description}
          footer={footer}
        >
          {children}
        </ListingFiltersSheet>
      </div>
    </div>
  );
}
