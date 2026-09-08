import { useCallback } from "react";

import type { Post } from "@/features/posts-management/types/types";
import { fetchPostById } from "@/services/postsService";
import { useFetch } from "@/shared/hooks/useFetch";

export function usePostDetailQuery(postId: string) {
  const load = useCallback(async (): Promise<Post | null> => {
    if (!postId) return null;
    return fetchPostById(postId);
  }, [postId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, null);

  return {
    post: data,
    isLoading,
    error,
    setError,
    reload,
  };
}
