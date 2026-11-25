import { Children, useState, type ReactNode } from "react";
import { ListFilter } from "lucide-react";

import { ListingFiltersSheet } from "@/shared/components/ListingFiltersSheet";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Sheet only when filter controls (not search) exceed this count. */
const SHEET_FILTER_THRESHOLD = 2;

type ListingFiltersChromeProps = {
  children?: ReactNode;
  /** Always visible (search). Never goes into the Filters sheet. */
  search?: ReactNode;
  /** Shown on the mobile Filters button when > 0. */
  activeCount?: number;
  /**
   * Override for the sheet rule. Defaults to `Children` count.
   * Use when one child wraps multiple controls (e.g. client + project).
   */
  filterCount?: number;
  title?: string;
  description?: string;
  className?: string;
  /** Extra controls always visible (e.g. bulk bar) — before search. */
  leading?: ReactNode;
  footer?: ReactNode;
};

/**
 * Search stays outside the sheet so typing shows live results.
 * Other filters stay inline when there are ≤2; above that, mobile uses
 * a Filters button → ListingFiltersSheet. Desktop (`md+`) always inline.
 */
export function ListingFiltersChrome({
  children,
  search,
  activeCount = 0,
  filterCount: filterCountProp,
  title = "Filters",
  description,
  className,
  leading,
  footer,
}: ListingFiltersChromeProps) {
  const [open, setOpen] = useState(false);
  const filterCount =
    filterCountProp ?? Children.toArray(children).filter(Boolean).length;
  const useSheet = filterCount > SHEET_FILTER_THRESHOLD;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center",
        className,
      )}
    >
      {leading}
      {search}

      {filterCount === 0 ? null : useSheet ? (
        <>
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
        </>
      ) : (
        <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}
