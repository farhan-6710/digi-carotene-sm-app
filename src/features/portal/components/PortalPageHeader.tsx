import type { PortalPageHeaderProps } from "@/features/portal/types/components";

export function PortalPageHeader({
  title,
  highlight,
  description,
}: PortalPageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-6 shadow-xs">
      <div
        className="absolute inset-y-0 left-0 w-1 bg-primary"
        aria-hidden="true"
      />
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl text-primary">
        {title}{" "}
        {highlight ? (
          <span className="text-foreground">{highlight}</span>
        ) : null}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
