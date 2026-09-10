import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { DayPostsTableRow } from "@/features/posts-management/components/DayPostsTableRow";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import { dayPostsDirectoryConfig } from "@/features/posts-management/constants/dayPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { DayPostsTableProps } from "@/features/posts-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function DayPostsTable({
  posts,
  projects,
  isLoading,
  selectedClientIds,
  selectedProjectIds,
  onClientChange,
  onProjectChange,
  onOpenPost,
}: DayPostsTableProps) {
  const { filteredPosts, statusFilter, setStatusFilter } =
    useProjectPostsFilters(posts);

  return (
    <DirectoryTable
      title={dayPostsDirectoryConfig.title}
      description={dayPostsDirectoryConfig.description}
      gridClass={dayPostsDirectoryConfig.gridClass}
      columns={dayPostsDirectoryConfig.columns}
      emptyMessage={dayPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={filteredPosts.length === 0}
      filters={
        <>
          <ClientProjectFilters
            projects={projects}
            selectedClientIds={selectedClientIds}
            selectedProjectIds={selectedProjectIds}
            onClientChange={onClientChange}
            onProjectChange={onProjectChange}
            className="grid w-full min-w-0 gap-2 sm:grid-cols-2 sm:max-w-xl"
          />
          <PostStatusSelect value={statusFilter} onChange={setStatusFilter} />
        </>
      }
    >
      {filteredPosts.map((post) => (
        <DayPostsTableRow
          key={post.id}
          post={post}
          onOpenPost={onOpenPost}
        />
      ))}
    </DirectoryTable>
  );
}
