import { useCallback, useMemo } from "react";

import { ProjectPostsTableRow } from "@/features/projects-management/components/ProjectPostsTableRow";
import {
  PROJECT_POSTS_BULK_GRID_CLASS,
  projectPostsColumns,
  projectPostsDirectoryConfig,
} from "@/features/projects-management/constants/projectPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { ProjectPostsTableProps } from "@/features/projects-management/types/components";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import type { DirectoryTableColumn } from "@/shared/types/components";
import { deletePostsByIds } from "@/services/postsService";

export function ProjectPostsTable({
  posts,
  isLoading,
  canDelete = false,
  reload,
  onOpenPost,
  onEditPost,
}: ProjectPostsTableProps) {
  const { filteredPosts, statusFilter, setStatusFilter } =
    useProjectPostsFilters(posts);

  const showBulk = canDelete && Boolean(reload);
  const visibleIds = useMemo(
    () => filteredPosts.map((post) => post.id),
    [filteredPosts],
  );
  const bulk = useDirectoryBulkSelection(showBulk ? visibleIds : []);
  const selectedSet = useMemo(() => new Set(bulk.selectedIds), [bulk.selectedIds]);

  const deleteByIds = useCallback((ids: string[]) => deletePostsByIds(ids), []);
  const safeReload = reload ?? (async () => {});
  const { isDeleting, runBulkDelete } = useDirectoryBulkDelete({
    deleteByIds,
    reload: safeReload,
    clearSelection: bulk.clear,
    successMessage: "Selected posts deleted.",
  });

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!showBulk) {
      return projectPostsColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={bulk.allVisibleSelected}
            onCheckedChange={bulk.toggleAllVisible}
            ariaLabel="Select all posts"
            disabled={isLoading || filteredPosts.length === 0}
          />
        ),
      },
      ...projectPostsColumns,
    ];
  }, [
    bulk.allVisibleSelected,
    bulk.toggleAllVisible,
    filteredPosts.length,
    isLoading,
    showBulk,
  ]);

  return (
    <DirectoryTable
      title={projectPostsDirectoryConfig.title}
      description={projectPostsDirectoryConfig.description}
      gridClass={
        showBulk
          ? PROJECT_POSTS_BULK_GRID_CLASS
          : projectPostsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={projectPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={filteredPosts.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {showBulk ? (
            <DirectoryBulkDeleteBar
              selectedCount={bulk.selectedIds.length}
              singularLabel="post"
              pluralLabel="posts"
              isDeleting={isDeleting}
              onClear={bulk.clear}
              onConfirmDelete={() => runBulkDelete(bulk.selectedIds)}
            />
          ) : null}
          <PostStatusSelect value={statusFilter} onChange={setStatusFilter} />
        </div>
      }
    >
      {filteredPosts.map((post) => (
        <ProjectPostsTableRow
          key={post.id}
          post={post}
          canDelete={showBulk}
          selected={selectedSet.has(post.id)}
          onToggleSelect={bulk.toggle}
          onOpenPost={onOpenPost}
          onEditPost={onEditPost}
        />
      ))}
    </DirectoryTable>
  );
}
