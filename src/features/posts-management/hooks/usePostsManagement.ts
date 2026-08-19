import { useMemo } from "react";

import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsQuery } from "@/features/posts-management/hooks/usePostsQuery";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";

export function usePostsManagement(
  year: number,
  month: number,
  selectedClientId: string,
  selectedProjectId: string,
) {
  const query = usePostsQuery(year, month);
  const projectClientMap = useMemo(
    () =>
      new Map(query.projects.map((project) => [project.id, project.client_id])),
    [query.projects],
  );
  const filteredPosts = useMemo(() => {
    return query.posts.filter((post) => {
      if (selectedProjectId && post.project_id !== selectedProjectId) {
        return false;
      }

      if (selectedClientId) {
        return projectClientMap.get(post.project_id) === selectedClientId;
      }

      return true;
    });
  }, [projectClientMap, query.posts, selectedClientId, selectedProjectId]);
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
