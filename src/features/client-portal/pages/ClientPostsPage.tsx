import { PortalPostsTable } from "@/features/portal/components/PortalPostsTable";
import { usePortalClient } from "@/features/portal/providers/PortalClientProvider";
import { PortalPageShell } from "@/shared/components/PortalPageShell";

export function PortalPostsPage() {
  const { posts, loading, error } = usePortalClient();

  return (
    <PortalPageShell
      heading="My Posts"
      description="Read-only view of every post scheduled for your brand."
      error={error && !loading ? error : null}
    >
      <PortalPostsTable posts={posts} isLoading={loading} />
    </PortalPageShell>
  );
}
