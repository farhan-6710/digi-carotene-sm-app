import { usePostDialog } from "@/features/posts-management/hooks/usePostDialog";
import { usePostsQuery } from "@/features/posts-management/hooks/usePostsQuery";

export function usePostsManagement(year: number, month: number) {
  const query = usePostsQuery(year, month);
  const dialogHook = usePostDialog({
    slots: query.slots,
    reload: query.reload,
    setError: query.setError,
  });

  return {
    isLoading: query.isLoading,
    error: query.error,
    getSlot: query.getSlot,
    openAddDialog: dialogHook.openAddDialog,
    openEditDialog: dialogHook.openEditDialog,
    statusOptions: dialogHook.statusOptions,
    dialog: dialogHook.dialog,
  };
}
