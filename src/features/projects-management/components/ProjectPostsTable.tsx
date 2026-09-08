import { ProjectPostsTableRow } from "@/features/projects-management/components/ProjectPostsTableRow";
import { projectPostsDirectoryConfig } from "@/features/projects-management/constants/projectPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { ProjectPostsTableProps } from "@/features/projects-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { PostStatusFilter } from "@/shared/ui/PostStatusFilter";

export function ProjectPostsTable({
  posts,
  isLoading,
  onOpenPost,
  onEditPost,
}: ProjectPostsTableProps) {
  const {
    filteredPosts,
    showAll,
    activeStatuses,
    toggleStatus,
    statusOptions,
  } = useProjectPostsFilters(posts);

  return (
    <DirectoryTable
      title={projectPostsDirectoryConfig.title}
      description={projectPostsDirectoryConfig.description}
      gridClass={projectPostsDirectoryConfig.gridClass}
      columns={projectPostsDirectoryConfig.columns}
      emptyMessage={projectPostsDirectoryConfig.emptyMessage}
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
        <ProjectPostsTableRow
          key={post.id}
          post={post}
          onOpenPost={onOpenPost}
          onEditPost={onEditPost}
        />
      ))}
    </DirectoryTable>
  );
}
