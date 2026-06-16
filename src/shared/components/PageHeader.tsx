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
    <header className="space-y-4">
      {backButton ? (
        <div className="flex items-center">{backButton}</div>
      ) : null}

      {hasActionsRow ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          {hasTitleBlock ? (
            <div className="min-w-0 flex-1">
              {heading ? (
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {heading}
                </h1>
              ) : null}
              {description ? (
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          ) : null}
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
