import { useMemo } from "react";

import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsQuery } from "@/features/posts-management/hooks/usePostsQuery";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";

export function usePostsManagement(
  year: number,
  month: number,
  selectedClientIds: string[],
  selectedProjectIds: string[],
) {
  const query = usePostsQuery(year, month);
  const projectClientMap = useMemo(
    () =>
      new Map(query.projects.map((project) => [project.id, project.client_id])),
    [query.projects],
  );
  const filteredPosts = useMemo(() => {
    if (selectedClientIds.length === 0 && selectedProjectIds.length === 0) {
      return query.posts;
    }

    return query.posts.filter((post) => {
      if (
        selectedProjectIds.length > 0 &&
        !selectedProjectIds.includes(post.project_id)
      ) {
        return false;
      }

      if (selectedClientIds.length > 0) {
        const clientId = projectClientMap.get(post.project_id);
        return clientId ? selectedClientIds.includes(clientId) : false;
      }

      return true;
    });
  }, [projectClientMap, query.posts, selectedClientIds, selectedProjectIds]);
  const filteredSlots = useMemo(
    () => postsToSlots(filteredPosts, year, month),
    [filteredPosts, year, month],
  );
  const dialogHook = usePostDialog({
    slots: filteredSlots,
    reload: query.reload,
    setError: query.setError,
  });

  return {
    isLoading: query.isLoading,
    error: query.error,
    projects: query.projects,
    filteredPosts,
    getSlot: (slotYear: number, slotMonth: number, date: number) =>
      filteredSlots.find(
        (slot) =>
          slot.year === slotYear &&
          slot.month === slotMonth &&
          slot.date === date,
      ),
    openEditDialog: dialogHook.openEditDialog,
    statusOptions: dialogHook.statusOptions,
    dialog: dialogHook.dialog,
  };
}
