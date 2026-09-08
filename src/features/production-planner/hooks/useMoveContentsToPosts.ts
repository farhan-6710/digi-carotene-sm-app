import { useCallback, useMemo, useState } from "react";

import { DEFAULT_POST_TIME } from "@/features/posts-management/constants/postSchedule";
import { DEFAULT_POST_TYPE } from "@/features/posts-management/constants/postsManagement";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import {
  canMoveContentToPosts,
  getContentPostScheduleDate,
} from "@/features/production-planner/utils/moveContentsToPostsUtils";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { createPost } from "@/services/postsService";
import { updateProductionPlanItem } from "@/services/productionPlanItemsService";
import { fetchProjectsByClientId } from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

type UseMoveContentsToPostsOptions = {
  clientId: string;
  planShootDate: string;
  contents: ProductionPlanContent[];
  enabled: boolean;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useMoveContentsToPosts({
  clientId,
  planShootDate,
  contents,
  enabled,
  reload,
  setError,
}: UseMoveContentsToPostsOptions) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [moveOpen, setMoveOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projects, setProjects] = useState<{ id: string; label: string }[]>(
    [],
  );

  const eligibleIds = useMemo(
    () => contents.filter(canMoveContentToPosts).map((item) => item.id),
    [contents],
  );

  const activeSelectedIds = useMemo(
    () => selectedIds.filter((id) => eligibleIds.includes(id)),
    [eligibleIds, selectedIds],
  );

  const toggleContentSelected = useCallback((contentId: string) => {
    setSelectedIds((current) =>
      current.includes(contentId)
        ? current.filter((id) => id !== contentId)
        : [...current, contentId],
    );
  }, []);

  const toggleSelectAllEligible = useCallback(() => {
    setSelectedIds((current) => {
      const active = current.filter((id) => eligibleIds.includes(id));
      return active.length === eligibleIds.length ? [] : eligibleIds;
    });
  }, [eligibleIds]);

  const openMoveTo = useCallback(async () => {
    if (activeSelectedIds.length === 0) {
      showToast("info", "Select at least one shoot-completed content.");
      return;
    }

    setMoveOpen(true);
    setIsLoadingProjects(true);
    try {
      const rows = await fetchProjectsByClientId(clientId);
      setProjects(
        rows
          .filter((project) => project.is_active)
          .map((project) => ({
            id: project.id,
            label: getProjectDisplayLabel(project),
          })),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load projects.";
      setError(message);
      showToast("error", message);
      setMoveOpen(false);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [activeSelectedIds.length, clientId, setError]);

  const moveToProject = useCallback(
    async (projectId: string) => {
      if (isMoving || activeSelectedIds.length === 0) return;

      setIsMoving(true);
      setError(null);

      let movedCount = 0;

      try {
        for (const contentId of activeSelectedIds) {
          const content = contents.find((item) => item.id === contentId);
          if (!content || !canMoveContentToPosts(content)) continue;

          const scheduleDate = getContentPostScheduleDate(
            content,
            planShootDate,
          );
          if (!scheduleDate) {
            throw new Error(
              `"${content.item_name}" needs a shoot date before it can be moved.`,
            );
          }

          const post = await createPost({
            projectId,
            postTitle: content.item_name.trim() || null,
            postType: content.post_type || DEFAULT_POST_TYPE,
            socials: content.socials?.length ? content.socials : null,
            postLinks: null,
            toBePostedOn: {
              date: scheduleDate,
              time: DEFAULT_POST_TIME,
            },
            posted: null,
            status: "Not posted",
            contentPillar: content.content_pillar,
            contextDescription: content.context_description,
            script: content.script,
            referenceLink: content.reference_link,
            shootDate: content.shoot_date,
            shootNotes: content.shoot_notes,
            sourceProductionPlanItemId: content.id,
          });

          await updateProductionPlanItem(contentId, {
            movedToPostId: post.id,
          });
          movedCount += 1;
        }

        showToast(
          "success",
          movedCount === 1
            ? "1 content moved to the postings calendar."
            : `${movedCount} contents moved to the postings calendar.`,
        );
        setSelectedIds([]);
        setMoveOpen(false);
        await reload();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to move content to posts.";
        setError(message);
        showToast("error", message);
        await reload();
      } finally {
        setIsMoving(false);
      }
    },
    [
      activeSelectedIds,
      contents,
      isMoving,
      planShootDate,
      reload,
      setError,
    ],
  );

  return {
    enabled,
    selectedIds: activeSelectedIds,
    eligibleCount: eligibleIds.length,
    allEligibleSelected:
      eligibleIds.length > 0 &&
      activeSelectedIds.length === eligibleIds.length,
    toggleContentSelected,
    toggleSelectAllEligible,
    moveOpen,
    setMoveOpen,
    openMoveTo,
    moveToProject,
    projects,
    isLoadingProjects,
    isMoving,
  };
}
