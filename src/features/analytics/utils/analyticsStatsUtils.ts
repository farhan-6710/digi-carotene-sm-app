import { ANALYTICS_STAT_CARD_META } from "@/features/analytics/constants/analyticsStatCards";
import { clientAnalyticsStats, employeeAnalyticsStats } from "@/features/analytics/constants/placeholderAnalytics";
import type { AnalyticsStatCard } from "@/features/analytics/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { StatCardItem, StatCardTrend } from "@/shared/types/statsCards";

function inferTrend(delta: string, invert = false): StatCardTrend {
  const isNegative = delta.startsWith("-") || delta.includes("-");
  if (invert) {
    return isNegative ? "positive" : "negative";
  }
  return isNegative ? "negative" : "positive";
}

function toStatCard(
  id: string,
  metaKey: keyof typeof ANALYTICS_STAT_CARD_META,
  stat: {
    label: string;
    value: string;
    delta: string;
    deltaLabel: string;
    trend?: StatCardTrend;
  },
  invertTrend = false,
): StatCardItem {
  const meta = ANALYTICS_STAT_CARD_META[metaKey];

  return {
    id,
    label: stat.label,
    value: stat.value,
    delta: stat.delta,
    deltaLabel: stat.deltaLabel,
    trend: stat.trend ?? inferTrend(stat.delta, invertTrend),
    icon: meta.icon,
    sparklineData: meta.sparklineData,
    sparklineColor: meta.sparklineColor,
  };
}

export function buildPostsAnalyticsStatCards(
  currentPosts: Post[],
  previousPosts: Post[],
): StatCardItem[] {
  const currentPublished = currentPosts.filter((post) => post.status === "Posted").length;
  const previousPublished = previousPosts.filter((post) => post.status === "Posted").length;
  const currentScheduled = currentPosts.filter((post) => post.status === "Scheduled").length;
  const previousScheduled = previousPosts.filter((post) => post.status === "Scheduled").length;
  const currentMissed = currentPosts.filter((post) => post.status === "Not posted").length;
  const previousMissed = previousPosts.filter((post) => post.status === "Not posted").length;
  const currentActiveClients = new Set(currentPosts.map((post) => post.client_name)).size;
  const previousClients = new Set(previousPosts.map((post) => post.client_name));
  const currentClients = new Set(currentPosts.map((post) => post.client_name));
  const newClients = [...currentClients].filter((name) => !previousClients.has(name)).length;

  const formatPercentDelta = (current: number, previous: number) => {
    if (previous === 0) {
      return current === 0 ? "0%" : "+100%";
    }
    const diff = ((current - previous) / previous) * 100;
    const rounded = Math.round(diff * 10) / 10;
    return rounded > 0 ? `+${rounded}%` : `${rounded}%`;
  };

  const formatSignedDelta = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff === 0) {
      return "0";
    }
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  return [
    toStatCard("posts-published", "postsPublished", {
      label: "Posts Published This Month",
      value: String(currentPublished),
      delta: formatPercentDelta(currentPublished, previousPublished),
      deltaLabel: "vs last month",
    }),
    toStatCard("posts-scheduled", "postsScheduled", {
      label: "Posts Scheduled",
      value: String(currentScheduled),
      delta: formatSignedDelta(currentScheduled, previousScheduled),
      deltaLabel: "vs last month",
    }),
    toStatCard("active-clients", "activeClients", {
      label: "Active Clients This Month",
      value: String(currentActiveClients),
      delta: newClients > 0 ? `+${newClients}` : String(newClients),
      deltaLabel: "new this month",
    }),
    toStatCard(
      "posts-missed",
      "postsMissed",
      {
        label: "Missed Posts This Month",
        value: String(currentMissed),
        delta: formatSignedDelta(currentMissed, previousMissed),
        deltaLabel: "from last month",
      },
      true,
    ),
  ];
}

export function buildAgencyAnalyticsStatCards(stats: AnalyticsStatCard[]): StatCardItem[] {
  const metaKeys = [
    "agencyPublished",
    "agencyActiveDays",
    "agencyStreak",
    "agencyMissedDays",
  ] as const;

  return stats.map((stat, index) =>
    toStatCard(
      `agency-${index}`,
      metaKeys[index],
      stat,
      metaKeys[index] === "agencyMissedDays",
    ),
  );
}

export function buildClientAnalyticsStatCards(): StatCardItem[] {
  const metaKeys = [
    "clientTotal",
    "clientActive",
    "clientAvgPosts",
    "clientFollowUp",
  ] as const;

  return clientAnalyticsStats.map((stat, index) =>
    toStatCard(`client-${index}`, metaKeys[index], stat, metaKeys[index] === "clientFollowUp"),
  );
}

export function buildEmployeeAnalyticsStatCards(): StatCardItem[] {
  const metaKeys = [
    "employeeTotal",
    "employeeAssignments",
    "employeeAvgClients",
    "employeeUnassigned",
  ] as const;

  return employeeAnalyticsStats.map((stat, index) =>
    toStatCard(
      `employee-${index}`,
      metaKeys[index],
      stat,
      metaKeys[index] === "employeeUnassigned",
    ),
  );
}
