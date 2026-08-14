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
  clientsCount: number | null;
  teamMembersCount: number | null;
  totalPostsCount: number | null;
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
      description: isAll
        ? "Active team members"
        : `Joined in ${period}`,
      icon: UserRound,
      sparklineData: employeesSparklineData,
      sparklineColor: "var(--primary)",
      href: TEAM_MANAGEMENT_PATH,
    },
    {
      id: "clients",
      label: "Total Active Clients",
      value: String(clientsCount ?? 0),
      description: isAll
        ? "Currently active registered brands"
        : `Active brands added in ${period}`,
      icon: Users,
      sparklineData: clientsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/team-portal/clients-management",
    },
    {
      id: "total-posts",
      label: "Total Posts",
      value: String(totalPostsCount ?? 0),
      description: isAll
        ? "All-time content pieces"
        : `Content pieces in ${period}`,
      icon: Layers,
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--primary)",
      href: "/team-portal/posts-management",
    },
    {
      id: "not-posted-posts",
      label: "Not Posted Posts",
      value: String(notPostedPostsCount ?? 0),
      description: isAll
        ? "Unpublished or failed slots"
        : `Unpublished slots in ${period}`,
      icon: XCircle,
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/team-portal/posts-management",
    },
  ];
}
