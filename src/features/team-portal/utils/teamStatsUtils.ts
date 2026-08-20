import { Users, UserRound, Layers, XCircle } from "lucide-react";

import {
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  totalPostsSparklineData,
} from "@/shared/fixtures/sparklines";
import { TEAM_MANAGEMENT_PATH } from "@/features/team-management/constants/routes";
import type { StatCardItem } from "@/shared/types/statsCards";

type TeamStatCounts = {
  /** Current active clients (not date-scoped). */
  clientsCount: number | null;
  /** Current team roster size (not date-scoped). */
  teamMembersCount: number | null;
  /** Posts in the selected period (or all-time when filter is All). */
  totalPostsCount: number | null;
  /** Not-posted posts in the selected period (or all-time when filter is All). */
  notPostedPostsCount: number | null;
  periodLabel: string;
};

export function buildTeamStatCards({
  clientsCount,
  teamMembersCount,
  totalPostsCount,
  notPostedPostsCount,
  periodLabel,
}: TeamStatCounts): StatCardItem[] {
  const isAll = periodLabel === "All";
  const period = periodLabel.toLowerCase();

  return [
    {
      id: "team-members",
      label: "Team Members",
      value: String(teamMembersCount ?? 0),
      description: "People currently on the team",
      icon: UserRound,
      sparklineData: employeesSparklineData,
      sparklineColor: "var(--primary)",
      href: TEAM_MANAGEMENT_PATH,
    },
    {
      id: "clients",
      label: "Active Clients",
      value: String(clientsCount ?? 0),
      description: "Brands currently marked active",
      icon: Users,
      sparklineData: clientsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/team-portal/clients-management",
    },
    {
      id: "total-posts",
      label: isAll ? "Total Posts" : "Posts",
      value: String(totalPostsCount ?? 0),
      description: isAll
        ? "All content pieces"
        : `Content pieces in ${period}`,
      icon: Layers,
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--primary)",
      href: "/team-portal/posts-management",
    },
    {
      id: "not-posted-posts",
      label: isAll ? "Not Posted" : "Not Posted",
      value: String(notPostedPostsCount ?? 0),
      description: isAll
        ? "Unpublished or missed slots"
        : `Unpublished slots in ${period}`,
      icon: XCircle,
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/team-portal/posts-management",
    },
  ];
}
