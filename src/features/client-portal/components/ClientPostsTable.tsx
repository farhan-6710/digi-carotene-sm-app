import { ClientPostsTableRow } from "@/features/client-portal/components/ClientPostsTableRow";
import { clientPostsDirectoryConfig } from "@/features/client-portal/constants/postsDirectory";
import type { ClientPostsTableProps } from "@/features/client-portal/types/components";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import { POST_STATUS_SELECT_ALL } from "@/features/posts-management/constants/postStatusSelect";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ClientPostsTable({
  posts,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: ClientPostsTableProps) {
  const hasStatusFilter = statusFilter !== POST_STATUS_SELECT_ALL;

  return (
    <DirectoryTable
      title={clientPostsDirectoryConfig.title}
      description={clientPostsDirectoryConfig.description}
      gridClass={clientPostsDirectoryConfig.gridClass}
      columns={clientPostsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim() || hasStatusFilter
          ? "No posts match those filters."
          : clientPostsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={posts.length === 0}
      headerAside={
        <ListingFiltersChrome
          title="Post filters"
          activeCount={hasStatusFilter ? 1 : 0}
          search={
            <ListingSearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search posts"
              disabled={isLoading}
            />
          }
        >
          <PostStatusSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
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
