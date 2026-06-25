import { useCallback, useState } from "react";

import type { StatusKey } from "@/features/posts-management/types/types";
import { updatePostStatus } from "@/features/posts-management/utils/postsRepository";
import { showToast } from "@/shared/utils/showToast";

type StatusChangeSuccessHandler = (
  postId: string,
  status: StatusKey,
) => void;

export function useTeamDashboardPostStatusChange() {
  const [updatingPostId, setUpdatingPostId] = useState<string | null>(null);

  const changeStatus = useCallback(
    async (
      postId: string,
      status: StatusKey,
      currentStatus: StatusKey,
      onSuccess: StatusChangeSuccessHandler,
    ) => {
      if (status === currentStatus) {
        return;
      }

      setUpdatingPostId(postId);

      try {
        await updatePostStatus(postId, status);
        onSuccess(postId, status);
        showToast("success", `Post marked as ${status}.`);
      } catch (err) {
        showToast(
          "error",
          err instanceof Error ? err.message : "Failed to update post status.",
        );
      } finally {
        setUpdatingPostId(null);
      }
    },
    [],
  );

  return { changeStatus, updatingPostId };
}
