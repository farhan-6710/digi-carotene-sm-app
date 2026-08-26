import { FolderKanban } from "lucide-react";

import { PageShell } from "@/shared/components/PageShell";

export function OtherProjectsPage() {
  return (
    <PageShell
      heading="Other Projects"
      description="Additional project types beyond social media and development."
    >
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground">
          <FolderKanban className="size-5" aria-hidden="true" />
        </div>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Coming soon
        </span>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Other project types will show up here. Nothing to manage in this
          section yet.
        </p>
      </div>
    </PageShell>
  );
}
