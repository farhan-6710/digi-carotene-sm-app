import { ClientPostsTable } from "@/features/client-portal/components/ClientPostsTable";
import { useClientPortal } from "@/features/client-portal/providers/ClientPortalProvider";
import { PageShell } from "@/shared/components/PageShell";

export function ClientPostsPage() {
  const { posts, loading, error } = useClientPortal();

  return (
    <PageShell
      heading="My Posts"
      description="Read-only view of every post scheduled for your brand."
      error={error && !loading ? error : null}
    >
      <ClientPostsTable posts={posts} isLoading={loading} />
    </PageShell>
  );
}
