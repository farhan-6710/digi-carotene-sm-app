import { useMemo, useState } from "react";

import { ClientPostsTable } from "@/features/client-portal/components/ClientPostsTable";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientPostsPage() {
  const { posts, loading, error } = useClientPortal();
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredPosts: statusPosts, statusFilter, setStatusFilter } =
    useProjectPostsFilters(posts);
  const filteredPosts = useMemo(
    () =>
      statusPosts.filter((post) =>
        matchesListingSearch(searchQuery, [
          post.post_title,
          post.project_name,
          (post.socials ?? []).join(" "),
          post.status,
        ]),
      ),
    [statusPosts, searchQuery],
  );

  return (
    <PageShell
      heading="My Posts"
      description="Read-only view of every post scheduled for your brand."
      error={error && !loading ? error : null}
    >
      <ClientPostsTable
        posts={filteredPosts}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </PageShell>
  );
}
