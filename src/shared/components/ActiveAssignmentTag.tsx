import { Children, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export type ActiveAssignmentTagProps = {
  label: string;
  meta?: string;
  badge?: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
};

export function ActiveAssignmentTag({
  label,
  meta,
  badge,
  disabled = false,
  onSelect,
}: ActiveAssignmentTagProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      title={meta ? `${label} · ${meta}` : label}
      className={cn(
        "inline-flex max-w-full cursor-pointer items-center gap-2 rounded-full border border-border/80 bg-secondary/40 px-3 py-1.5 text-left text-sm font-medium text-foreground shadow-xs transition-colors",
        "hover:border-primary/30 hover:bg-secondary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      <span className="truncate">{label}</span>
      {badge}
      {meta ? (
        <span className="hidden shrink-0 text-[11px] font-normal text-muted-foreground sm:inline">
          {meta}
        </span>
      ) : null}
    </button>
  );
}

export type ActiveAssignmentTagsProps = {
  children: ReactNode;
  emptyMessage: string;
  isLoading: boolean;
};

export function ActiveAssignmentTags({
  children,
  emptyMessage,
  isLoading,
}: ActiveAssignmentTagsProps) {
  const hasItems = Children.count(children) > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[72px] items-center justify-center px-6 py-5">
        <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-6 py-5">
      {hasItems ? (
        <div className="flex flex-wrap gap-2">{children}</div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}
