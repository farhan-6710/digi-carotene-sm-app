import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  UserCheck,
  UserRound,
  Users,
  UserX,
  XCircle,
} from "lucide-react";

import {
  agencyActiveDaysSparklineData,
  agencyMissedDaysSparklineData,
  agencyPublishedSparklineData,
  agencyStreakSparklineData,
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  postsScheduledSparklineData,
  totalPostsSparklineData,
} from "@/shared/fixtures/sparklines";

export const ANALYTICS_STAT_CARD_META = {
  postsPublished: {
    icon: CheckCircle,
    sparklineData: totalPostsSparklineData,
    sparklineColor: "var(--primary)",
  },
  postsScheduled: {
    icon: Calendar,
    sparklineData: postsScheduledSparklineData,
    sparklineColor: "var(--primary)",
  },
  activeClients: {
    icon: Users,
    sparklineData: clientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  postsMissed: {
    icon: XCircle,
    sparklineData: missedPostsSparklineData,
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
    sparklineData: clientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientActive: {
    icon: Activity,
    sparklineData: employeesSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientAvgPosts: {
    icon: BarChart3,
    sparklineData: totalPostsSparklineData,
    sparklineColor: "var(--primary)",
  },
  clientFollowUp: {
    icon: Clock,
    sparklineData: missedPostsSparklineData,
    sparklineColor: "var(--accent)",
  },
  employeeTotal: {
    icon: UserRound,
    sparklineData: employeesSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeAssignments: {
    icon: Briefcase,
    sparklineData: clientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeAvgClients: {
    icon: UserCheck,
    sparklineData: totalPostsSparklineData,
    sparklineColor: "var(--primary)",
  },
  employeeUnassigned: {
    icon: UserX,
    sparklineData: missedPostsSparklineData,
    sparklineColor: "var(--accent)",
  },
} as const;
