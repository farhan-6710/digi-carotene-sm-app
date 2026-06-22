import { Users, UserRound, Layers, XCircle } from "lucide-react";

import {
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  totalPostsSparklineData,
} from "@/shared/fixtures/sparklines";
import { TEAM_MANAGEMENT_PATH } from "@/features/team-management/constants/routes";
import type { StatCardItem } from "@/shared/types/statsCards";

type AdminStatCounts = {
  clientsCount: number | null;
  teamMembersCount: number | null;
  totalPostsCount: number | null;
  missedPostsCount: number | null;
};

export function buildAdminStatCards({
  clientsCount,
  teamMembersCount,
  totalPostsCount,
  missedPostsCount,
}: AdminStatCounts): StatCardItem[] {
  return [
    {
      id: "team-members",
      label: "Team Members",
      value: String(teamMembersCount ?? 0),
      description: "Active team members",
      icon: UserRound,
      sparklineData: employeesSparklineData,
      sparklineColor: "var(--primary)",
      href: TEAM_MANAGEMENT_PATH,
    },
    {
      id: "clients",
      label: "Total Clients",
      value: String(clientsCount ?? 0),
      description: "Active registered brands",
      icon: Users,
      sparklineData: clientsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/admin/clients-management",
    },
    {
      id: "total-posts",
      label: "Total Posts",
      value: String(totalPostsCount ?? 0),
      description: "All-time content pieces",
      icon: Layers,
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--primary)",
      href: "/admin/posts-management",
    },
    {
      id: "missed-posts",
      label: "Missed Posts",
      value: String(missedPostsCount ?? 0),
      description: "Unpublished or failed slots",
      icon: XCircle,
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
      href: "/admin/posts-management",
    },
  ];
}
