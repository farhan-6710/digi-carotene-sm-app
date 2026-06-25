import { useCallback, useEffect, useState } from "react";

import type { StatusKey } from "@/features/posts-management/types/types";
import { fetchTodayPosts } from "@/features/posts-management/utils/postsRepository";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import { TEAM_TODAYS_POSTS_LIMIT } from "@/features/team-portal/constants/teamDashboardPosts";
import type { TeamTodaysPostItem } from "@/features/team-portal/types/types";
import { buildTodaysPostScheduleLabel } from "@/features/team-portal/utils/teamDashboardPostUtils";
import { mapPostsToTodaysPosts } from "@/features/team-portal/utils/teamTodaysPostsUtils";

export function useTeamTodaysPostsQuery() {
  const [items, setItems] = useState<TeamTodaysPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const posts = await fetchTodayPosts();
      setItems(mapPostsToTodaysPosts(posts).slice(0, TEAM_TODAYS_POSTS_LIMIT));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load today's posts.",
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItemStatus = useCallback((postId: string, status: StatusKey) => {
    const now = new Date();

    setItems((current) =>
      current.map((item) => {
        if (item.id !== postId) {
          return item;
        }

        const dueAt = parseDateTime(
          now.toISOString().slice(0, 10),
          item.toBePostedTime,
        );

        return {
          ...item,
          postStatus: status,
          isOverdue: status === "Posted" ? false : item.isOverdue,
          scheduleLabel: buildTodaysPostScheduleLabel(
            item.toBePostedTime,
            now,
            dueAt,
            status,
          ),
        };
      }),
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    void reload();
  }, [reload]);

  return { items, isLoading, error, reload, updateItemStatus };
}
