import { useCallback, useEffect, useMemo, useState } from "react";

import { filterPostsByDateRange } from "@/features/analytics/utils/analyticsFilterUtils";
import { buildPostsTopClients } from "@/features/analytics/utils/postsAnalyticsUtils";
import type { Client } from "@/features/clients-management/types/types";
import type { Post, StatusKey } from "@/features/posts-management/types/types";
import { parseDateTime } from "@/features/posts-management/utils/postScheduleUtils";
import type { TeamMember } from "@/features/team-management/types/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  TEAM_NEEDS_ATTENTION_LIMIT,
  TEAM_TODAYS_POSTS_LIMIT,
} from "@/features/team-portal/constants/teamDashboardPosts";
import type {
  TeamNeedsAttentionItem,
  TeamTodaysPostItem,
} from "@/features/team-portal/types/types";
import { buildTodaysPostScheduleLabel } from "@/features/team-portal/utils/teamDashboardPostUtils";
import { mapPostsToTodaysPosts } from "@/features/team-portal/utils/teamTodaysPostsUtils";
import { buildTeamStatCards } from "@/features/team-portal/utils/teamStatsUtils";
import { fetchTeamDashboardPostsBundle } from "@/services/dashboardService";
import { fetchTeamNeedsAttentionItems } from "@/services/teamNeedsAttentionService";
import type { DateFiltersTwoFilterState } from "@/shared/types/components";
import {
  formatDateFiltersTwoLabel,
  resolveDateFiltersTwoRange,
} from "@/shared/utils/dateFiltersTwoUtils";

export function useTeamDashboardQuery(filter: DateFiltersTwoFilterState) {
  const { teamMemberId } = useAuth();
  const [todaysPosts, setTodaysPosts] = useState<TeamTodaysPostItem[]>([]);
  const [needsAttentionItems, setNeedsAttentionItems] = useState<
    TeamNeedsAttentionItem[]
  >([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const bundle = await fetchTeamDashboardPostsBundle();
      const attentionItems = teamMemberId
        ? await fetchTeamNeedsAttentionItems(teamMemberId)
        : [];

      setClients(bundle.clients);
      setTeamMembers(bundle.teamMembers);
      setTodaysPosts(
        mapPostsToTodaysPosts(bundle.todayPosts).slice(
          0,
          TEAM_TODAYS_POSTS_LIMIT,
        ),
      );
      setNeedsAttentionItems(
        attentionItems.slice(0, TEAM_NEEDS_ATTENTION_LIMIT),
      );
      setPosts(bundle.posts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [teamMemberId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    },
    [],
  );

  const range = useMemo(
    () => resolveDateFiltersTwoRange(filter),
    [filter],
  );
  const periodLabel = useMemo(
    () => formatDateFiltersTwoLabel(filter),
    [filter],
  );
  const scopedPosts = useMemo(
    () => (range ? filterPostsByDateRange(posts, range) : posts),
    [posts, range],
  );

  const topClients = useMemo(
    () => buildPostsTopClients(scopedPosts),
    [scopedPosts],
  );

  const statCards = useMemo(() => {
    const clientsCount = clients.filter((client) => client.is_active).length;
    const teamMembersCount = teamMembers.length;

    return buildTeamStatCards({
      clientsCount,
      teamMembersCount,
      totalPostsCount: scopedPosts.length,
      notPostedPostsCount: scopedPosts.filter(
        (post) => post.status === "Not posted",
      ).length,
      periodLabel,
    });
  }, [clients, periodLabel, scopedPosts, teamMembers]);

  return {
    statCards,
    topClients,
    todaysPosts,
    needsAttentionItems,
    isStatsLoading: isLoading,
    isPostsLoading: isLoading,
    isSidebarPostsLoading: isLoading,
    error,
    reload,
    updateTodayPostStatus,
  };
}
