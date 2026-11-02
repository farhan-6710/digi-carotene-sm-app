import { useCallback, useState } from "react";

import { showToast } from "@/shared/utils/showToast";

type UseDirectoryBulkDeleteOptions = {
  deleteByIds: (ids: string[]) => Promise<void>;
  reload: () => Promise<void>;
  clearSelection: () => void;
  successMessage: string;
};

export function useDirectoryBulkDelete({
  deleteByIds,
  reload,
  clearSelection,
  successMessage,
}: UseDirectoryBulkDeleteOptions) {
  const [isDeleting, setIsDeleting] = useState(false);

  const runBulkDelete = useCallback(
    async (ids: string[]) => {
      if (isDeleting || ids.length === 0) return;
      setIsDeleting(true);
      try {
        await deleteByIds(ids);
        showToast("success", successMessage);
        clearSelection();
        await reload();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete selected items.";
        showToast("error", message);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [clearSelection, deleteByIds, isDeleting, reload, successMessage],
  );

  return { isDeleting, runBulkDelete };
}
