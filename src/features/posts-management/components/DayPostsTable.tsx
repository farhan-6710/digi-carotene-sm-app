import { DayPostsTableRow } from "@/features/posts-management/components/DayPostsTableRow";
import { dayPostsDirectoryConfig } from "@/features/posts-management/constants/dayPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { DayPostsTableProps } from "@/features/posts-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { PostStatusFilter } from "@/shared/ui/PostStatusFilter";

export function DayPostsTable({ posts, isLoading, onEditPost }: DayPostsTableProps) {
  const {
    filteredPosts,
    showAll,
    activeStatuses,
    toggleStatus,
    statusOptions,
  } = useProjectPostsFilters(posts);

  return (
    <DirectoryTable
      title={dayPostsDirectoryConfig.title}
      description={dayPostsDirectoryConfig.description}
      gridClass={dayPostsDirectoryConfig.gridClass}
      columns={dayPostsDirectoryConfig.columns}
      emptyMessage={dayPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={filteredPosts.length === 0}
      headerAside={
        <PostStatusFilter
          options={statusOptions}
          showAll={showAll}
          activeStatuses={activeStatuses}
          onToggle={toggleStatus}
        />
      }
    >
      {filteredPosts.map((post) => (
        <DayPostsTableRow
          key={post.id}
          post={post}
          onEditPost={onEditPost}
        />
      ))}
    </DirectoryTable>
  );
}
