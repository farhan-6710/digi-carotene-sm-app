import { useCallback, useMemo } from "react";

import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { DayPostsTableRow } from "@/features/posts-management/components/DayPostsTableRow";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import {
  DAY_POSTS_BULK_GRID_CLASS,
  dayPostsColumns,
  dayPostsDirectoryConfig,
} from "@/features/posts-management/constants/dayPostsDirectory";
import type { DayPostsTableProps } from "@/features/posts-management/types/components";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import type { DirectoryTableColumn } from "@/shared/types/components";
import { deletePostsByIds } from "@/services/postsService";

export function DayPostsTable({
  posts,
  projects,
  isLoading,
  canDelete = false,
  reload,
  selectedClientIds,
  selectedProjectIds,
  onClientChange,
  onProjectChange,
  onOpenPost,
}: DayPostsTableProps) {
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
      return dayPostsColumns;
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
      ...dayPostsColumns,
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
      title={dayPostsDirectoryConfig.title}
      description={dayPostsDirectoryConfig.description}
      gridClass={
        showBulk ? DAY_POSTS_BULK_GRID_CLASS : dayPostsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={dayPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={filteredPosts.length === 0}
      headerAside={
        showBulk ? (
          <DirectoryBulkDeleteBar
            selectedCount={bulk.selectedIds.length}
            singularLabel="post"
            pluralLabel="posts"
            isDeleting={isDeleting}
            onClear={bulk.clear}
            onConfirmDelete={() => runBulkDelete(bulk.selectedIds)}
          />
        ) : null
      }
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
          canDelete={showBulk}
          selected={selectedSet.has(post.id)}
          onToggleSelect={bulk.toggle}
          onOpenPost={onOpenPost}
        />
      ))}
    </DirectoryTable>
  );
}
