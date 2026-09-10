import { useMemo } from "react";

import {
  POST_STATUS_SELECT_ALL,
  type PostStatusSelectId,
} from "@/features/posts-management/constants/postStatusSelect";
import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsQuery } from "@/features/posts-management/hooks/usePostsQuery";
import { postsToSlots } from "@/features/posts-management/utils/postsSlots";

export function usePostsManagement(
  year: number,
  month: number,
  selectedClientIds: string[],
  selectedProjectIds: string[],
  statusFilter: PostStatusSelectId = POST_STATUS_SELECT_ALL,
) {
  const query = usePostsQuery(year, month);
  const projectClientMap = useMemo(
    () =>
      new Map(query.projects.map((project) => [project.id, project.client_id])),
    [query.projects],
  );
  const filteredPosts = useMemo(() => {
    return query.posts.filter((post) => {
      if (
        statusFilter !== POST_STATUS_SELECT_ALL &&
        post.status !== statusFilter
      ) {
        return false;
      }

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
  }, [
    projectClientMap,
    query.posts,
    selectedClientIds,
    selectedProjectIds,
    statusFilter,
  ]);
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
