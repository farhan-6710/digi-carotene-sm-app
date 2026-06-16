import { PortalPageIntro } from "@/features/portal/components/PortalPageIntro";
import { PortalPostsTable } from "@/features/portal/components/PortalPostsTable";
import { usePortalClient } from "@/features/portal/providers/PortalClientProvider";

export function PortalPostsPage() {
  const { posts, loading, error } = usePortalClient();

  return (
    <section className="space-y-8">
      <PortalPageIntro
        title="My Posts"
        description="Read-only view of every post scheduled for your brand."
      />

      {error && !loading ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <PortalPostsTable posts={posts} isLoading={loading} />
    </section>
  );
}
