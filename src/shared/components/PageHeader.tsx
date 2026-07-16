import type { PageHeaderProps } from "@/shared/types/components";

export function PageHeader({
  heading,
  description,
  backButton,
  actions,
}: PageHeaderProps) {
  const hasTitleBlock = Boolean(heading || description);
  const hasActionsRow = hasTitleBlock || actions;

  return (
    <header className="w-full min-w-0 space-y-4">
      {backButton ? (
        <div className="flex items-center">{backButton}</div>
      ) : null}

      {hasActionsRow ? (
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {hasTitleBlock ? (
            <div className="min-w-0 w-full lg:flex-1">
              {heading ? (
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {heading}
                </h1>
              ) : null}
              {description ? (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}
          {actions ? (
            <div
              className={
                hasTitleBlock
                  ? "flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:shrink-0 lg:justify-end"
                  : "w-full min-w-0"
              }
            >
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
