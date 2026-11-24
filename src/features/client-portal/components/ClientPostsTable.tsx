import { ClientPostsTableRow } from "@/features/client-portal/components/ClientPostsTableRow";
import { clientPostsDirectoryConfig } from "@/features/client-portal/constants/postsDirectory";
import type { ClientPostsTableProps } from "@/features/client-portal/types/components";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ClientPostsTable({
  posts,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ClientPostsTableProps) {
  return (
    <DirectoryTable
      title={clientPostsDirectoryConfig.title}
      description={clientPostsDirectoryConfig.description}
      gridClass={clientPostsDirectoryConfig.gridClass}
      columns={clientPostsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No posts match that search."
          : clientPostsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={posts.length === 0}
      headerAside={
        <ListingFiltersChrome
          title="Post filters"
          activeCount={searchQuery.trim() ? 1 : 0}
        >
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search posts"
            disabled={isLoading}
          />
        </ListingFiltersChrome>
      }
    >
      {posts.map((post) => (
        <ClientPostsTableRow key={post.id} post={post} />
      ))}
    </DirectoryTable>
  );
}
