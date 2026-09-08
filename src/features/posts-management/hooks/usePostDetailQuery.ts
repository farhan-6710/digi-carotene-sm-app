import { useCallback } from "react";

import type { Post } from "@/features/posts-management/types/types";
import {
  buildPostContentView,
  type PostContentView,
} from "@/features/posts-management/utils/postContentViewUtils";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import {
  fetchProductionPlanItemById,
  fetchProductionPlanItemByPostId,
} from "@/services/productionPlanItemsService";
import { fetchPostById } from "@/services/postsService";
import { useFetch } from "@/shared/hooks/useFetch";

type PostDetailData = {
  post: Post | null;
  contentView: PostContentView | null;
};

const EMPTY: PostDetailData = { post: null, contentView: null };

async function loadPlanContentForPost(
  post: Post,
): Promise<ProductionPlanContent | null> {
  if (post.source_production_plan_item_id) {
    const byId = await fetchProductionPlanItemById(
      post.source_production_plan_item_id,
    );
    if (byId) return byId;
  }
  return fetchProductionPlanItemByPostId(post.id);
}

export function usePostDetailQuery(postId: string) {
  const load = useCallback(async (): Promise<PostDetailData> => {
    if (!postId) return EMPTY;
    const post = await fetchPostById(postId);
    if (!post) return EMPTY;
    const planContent = await loadPlanContentForPost(post);
    return {
      post,
      contentView: buildPostContentView(post, planContent),
    };
  }, [postId]);

  const { data, isLoading, error, setError, reload } = useFetch(load, EMPTY);

  return {
    post: data.post,
    contentView: data.contentView,
    isLoading,
    error,
    setError,
    reload,
  };
}
