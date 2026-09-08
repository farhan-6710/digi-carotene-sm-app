import type { Post, PostType } from "@/features/posts-management/types/types";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";

/** Read-only content fields shown on post detail (from plan item or post snapshot). */
export type PostContentView = {
  title: string | null;
  contentPillar: string | null;
  contextDescription: string | null;
  script: string | null;
  referenceLink: string | null;
  shootDate: string | null;
  shootNotes: string | null;
  postType: PostType;
  socials: string[] | null;
};

function hasContentFields(content: PostContentView): boolean {
  return Boolean(
    content.contentPillar?.trim() ||
      content.contextDescription?.trim() ||
      content.script?.trim() ||
      content.referenceLink?.trim() ||
      content.shootDate ||
      content.shootNotes?.trim(),
  );
}

export function buildPostContentView(
  post: Post,
  planContent: ProductionPlanContent | null,
): PostContentView | null {
  if (planContent) {
    return {
      title: planContent.item_name,
      contentPillar: planContent.content_pillar,
      contextDescription: planContent.context_description,
      script: planContent.script,
      referenceLink: planContent.reference_link,
      shootDate: planContent.shoot_date,
      shootNotes: planContent.shoot_notes,
      postType: planContent.post_type || post.post_type,
      socials: planContent.socials ?? post.socials,
    };
  }

  const fromPost: PostContentView = {
    title: post.post_title,
    contentPillar: post.content_pillar,
    contextDescription: post.context_description,
    script: post.script,
    referenceLink: post.reference_link,
    shootDate: post.shoot_date,
    shootNotes: post.shoot_notes,
    postType: post.post_type,
    socials: post.socials,
  };

  return hasContentFields(fromPost) ? fromPost : null;
}
