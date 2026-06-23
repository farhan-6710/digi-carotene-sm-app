import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import type { PageShellProps } from "@/shared/types/components";

export function PageShell({
  heading,
  description,
  actions,
  error = null,
  children,
  dialog,
}: PageShellProps) {
  return (
    <section className="space-y-8">
      <PageHeader
        heading={heading}
        description={description}
        actions={actions}
      />

      {error ? <ErrorBanner message={error} /> : null}

      {children}

      {dialog}
    </section>
  );
}
