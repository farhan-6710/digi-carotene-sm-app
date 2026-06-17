import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import type { ManagementPageShellProps } from "@/shared/types/components";

export function ManagementPageShell({
  heading,
  description,
  actions,
  error,
  children,
  dialog,
}: ManagementPageShellProps) {
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
