import { ProjectPostsTableRow } from "@/features/projects-management/components/ProjectPostsTableRow";
import { projectPostsDirectoryConfig } from "@/features/projects-management/constants/projectPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { ProjectPostsTableProps } from "@/features/projects-management/types/components";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ProjectPostsTable({
  posts,
  isLoading,
  onOpenPost,
  onEditPost,
}: ProjectPostsTableProps) {
  const { filteredPosts, statusFilter, setStatusFilter } =
    useProjectPostsFilters(posts);

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
        <PostStatusSelect value={statusFilter} onChange={setStatusFilter} />
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
