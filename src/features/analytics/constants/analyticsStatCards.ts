import {
  Users,
  UserRound,
  XCircle,
  CheckCircle,
  Calendar,
  Activity,
  BarChart3,
  Clock,
  Briefcase,
  UserCheck,
  UserX,
  Flame,
} from "lucide-react";

import {
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  totalPostsSparklineData,
} from "@/features/dashboard/constants/dashboard";

// Jagged sparkline coordinates (same style as dashboard cards — sharp ups/downs, not smooth ramps)

export const postsPublishedSparklineData = totalPostsSparklineData;

export const postsScheduledSparklineData = [
  { value: 6 },
  { value: 22 },
  { value: 3 },
  { value: 18 },
  { value: 5 },
  { value: 25 },
  { value: 8 },
  { value: 16 },
  { value: 4 },
  { value: 20 },
];

export const activeClientsSparklineData = clientsSparklineData;

export const postsMissedSparklineData = missedPostsSparklineData;

export const agencyPublishedSparklineData = [
  { value: 95 },
  { value: 180 },
  { value: 78 },
  { value: 165 },
  { value: 110 },
  { value: 200 },
  { value: 90 },
  { value: 175 },
  { value: 125 },
  { value: 190 },
];

export const agencyActiveDaysSparklineData = [
  { value: 22 },
  { value: 12 },
  { value: 27 },
  { value: 18 },
  { value: 26 },
  { value: 15 },
  { value: 28 },
  { value: 19 },
  { value: 24 },
  { value: 21 },
];

export const agencyStreakSparklineData = [
  { value: 5 },
  { value: 12 },
  { value: 1 },
  { value: 9 },
  { value: 3 },
  { value: 11 },
  { value: 2 },
  { value: 10 },
  { value: 4 },
  { value: 8 },
];

export const agencyMissedDaysSparklineData = [
  { value: 12 },
  { value: 5 },
  { value: 10 },
  { value: 3 },
  { value: 14 },
  { value: 6 },
  { value: 11 },
  { value: 2 },
  { value: 9 },
  { value: 7 },
];

export const clientPortfolioSparklineData = clientsSparklineData;

export const clientActiveSparklineData = employeesSparklineData;

export const clientAvgPostsSparklineData = totalPostsSparklineData;

export const clientFollowUpSparklineData = missedPostsSparklineData;

export const employeeTeamSparklineData = employeesSparklineData;

export const employeeAssignmentsSparklineData = clientsSparklineData;

export const employeeAvgClientsSparklineData = totalPostsSparklineData;

export const employeeUnassignedSparklineData = missedPostsSparklineData;

export const ANALYTICS_STAT_CARD_META = {
  postsPublished: {
    icon: CheckCircle,
    sparklineData: postsPublishedSparklineData,
    sparklineColor: "var(--primary)",
  },
  postsScheduled: {
    icon: Calendar,
    sparklineData: postsScheduledSparklineData,
    sparklineColor: "var(--primary)",
  },
  activeClients: {
    icon: Users,
    sparklineData: activeClientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  postsMissed: {
    icon: XCircle,
    sparklineData: postsMissedSparklineData,
    sparklineColor: "var(--accent)",
  },
  agencyPublished: {
    icon: CheckCircle,
    sparklineData: agencyPublishedSparklineData,
    sparklineColor: "var(--primary)",
  },
  agencyActiveDays: {
    icon: Calendar,
    sparklineData: agencyActiveDaysSparklineData,
    sparklineColor: "var(--primary)",
  },
  agencyStreak: {
    icon: Flame,
    sparklineData: agencyStreakSparklineData,
    sparklineColor: "var(--primary)",
  },
  agencyMissedDays: {
    icon: XCircle,
    sparklineData: agencyMissedDaysSparklineData,
    sparklineColor: "var(--accent)",
  },
  clientTotal: {
    icon: Users,
    sparklineData: clientPortfolioSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientActive: {
    icon: Activity,
    sparklineData: clientActiveSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientAvgPosts: {
    icon: BarChart3,
    sparklineData: clientAvgPostsSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientFollowUp: {
    icon: Clock,
    sparklineData: clientFollowUpSparklineData,
    sparklineColor: "var(--accent)",
  },
  employeeTotal: {
    icon: UserRound,
    sparklineData: employeeTeamSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeAssignments: {
    icon: Briefcase,
    sparklineData: employeeAssignmentsSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeAvgClients: {
    icon: UserCheck,
    sparklineData: employeeAvgClientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeUnassigned: {
    icon: UserX,
    sparklineData: employeeUnassignedSparklineData,
    sparklineColor: "var(--accent)",
  },
} as const;
