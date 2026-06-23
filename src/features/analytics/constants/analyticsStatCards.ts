import { Calendar, CheckCircle, Users, XCircle } from "lucide-react";

import {
  clientsSparklineData,
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
    sparklineColor: "var(--accent)",
  },
  activeClients: {
    icon: Users,
    sparklineData: clientsSparklineData,
    sparklineColor: "var(--primary)",
  },
  postsNotPosted: {
    icon: XCircle,
    sparklineData: missedPostsSparklineData,
    sparklineColor: "var(--accent)",
  },
} as const;
