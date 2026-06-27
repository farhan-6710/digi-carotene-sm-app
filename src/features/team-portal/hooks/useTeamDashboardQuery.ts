import { useCallback, useEffect, useMemo, useState } from "react";

import type { PostsTopClient } from "@/features/analytics/types/types";
import { buildPostsTopClients } from "@/features/analytics/utils/postsAnalyticsUtils";
import type { StatusKey } from "@/features/posts-management/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import {
  TEAM_NEEDS_ATTENTION_LIMIT,
  TEAM_TODAYS_POSTS_LIMIT,
} from "@/features/team-portal/constants/teamDashboardPosts";
import type {
  TeamNeedsAttentionItem,
  TeamTodaysPostItem,
} from "@/features/team-portal/types/types";
import { buildTodaysPostScheduleLabel } from "@/features/team-portal/utils/teamDashboardPostUtils";
import { fetchTeamDashboardPostsBundle } from "@/services/dashboardService";
import { mapNotPostedPostsToNeedsAttention } from "@/features/team-portal/utils/teamNeedsAttentionUtils";
import { mapPostsToTodaysPosts } from "@/features/team-portal/utils/teamTodaysPostsUtils";
import { buildTeamStatCards } from "@/features/team-portal/utils/teamStatsUtils";

export function useTeamDashboardQuery() {
  const [todaysPosts, setTodaysPosts] = useState<TeamTodaysPostItem[]>([]);
  const [needsAttentionPosts, setNeedsAttentionPosts] = useState<
    TeamNeedsAttentionItem[]
  >([]);
  const [topClients, setTopClients] = useState<PostsTopClient[]>([]);
  const [counts, setCounts] = useState({
    clientsCount: null as number | null,
    teamMembersCount: null as number | null,
    totalPostsCount: null as number | null,
    notPostedPostsCount: null as number | null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { counts: nextCounts, todayPosts, notPostedPosts, currentMonthPosts } =
        await fetchTeamDashboardPostsBundle();

      setCounts({
        clientsCount: nextCounts.clientsCount,
        teamMembersCount: nextCounts.teamMembersCount,
        totalPostsCount: nextCounts.totalPostsCount,
        notPostedPostsCount: nextCounts.notPostedPostsCount,
      });
      setTodaysPosts(
        mapPostsToTodaysPosts(todayPosts).slice(0, TEAM_TODAYS_POSTS_LIMIT),
      );
      setNeedsAttentionPosts(
        mapNotPostedPostsToNeedsAttention(notPostedPosts).slice(
          0,
          TEAM_NEEDS_ATTENTION_LIMIT,
        ),
      );
      setTopClients(buildPostsTopClients(currentMonthPosts));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateTodayPostStatus = useCallback(
    (postId: string, status: StatusKey) => {
      const now = new Date();

      setTodaysPosts((current) =>
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

      if (status !== "Not posted") {
        setCounts((current) => ({
          ...current,
          notPostedPostsCount:
            current.notPostedPostsCount === null
              ? current.notPostedPostsCount
              : Math.max(0, current.notPostedPostsCount - 1),
        }));
        setNeedsAttentionPosts((current) =>
          current.filter((item) => item.id !== postId),
        );
      }
    },
    [],
  );

  const removeNeedsAttentionPost = useCallback((postId: string) => {
    setNeedsAttentionPosts((current) =>
      current.filter((item) => item.id !== postId),
    );
    setCounts((current) => ({
      ...current,
      notPostedPostsCount:
        current.notPostedPostsCount === null
          ? current.notPostedPostsCount
          : Math.max(0, current.notPostedPostsCount - 1),
    }));
  }, []);

  const statCards = useMemo(
    () => buildTeamStatCards(counts),
    [counts],
  );

  return {
    statCards,
    topClients,
    todaysPosts,
    needsAttentionPosts,
    isStatsLoading: isLoading,
    isPostsLoading: isLoading,
    isSidebarPostsLoading: isLoading,
    error,
    reload,
    updateTodayPostStatus,
    removeNeedsAttentionPost,
  };
}
