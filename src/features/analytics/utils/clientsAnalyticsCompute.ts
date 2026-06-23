import { Clock, Users, Activity, BarChart3 } from "lucide-react";

import type {
  EntityPostBreakdown,
  LabeledValue,
} from "@/features/analytics/types/types";
import { getCurrentMonthKey, isPostInMonth } from "@/features/analytics/utils/analyticsDateUtils";
import type { Client } from "@/features/clients-management/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

const UNKNOWN_CLIENT = "Unknown client";

export function buildClientBreakdowns(
  posts: Post[],
  clients: Client[],
): EntityPostBreakdown[] {
  const rows = new Map<string, EntityPostBreakdown>();
  const idByName = new Map(clients.map((client) => [client.client_name, client.id]));

  for (const post of posts) {
    const name = post.client_name ?? UNKNOWN_CLIENT;
    const row = rows.get(name) ?? {
      id: idByName.get(name) ?? name,
      name,
      total: 0,
      posted: 0,
      scheduled: 0,
      notPosted: 0,
    };

    row.total += 1;
    if (post.status === "Posted") row.posted += 1;
    else if (post.status === "Scheduled") row.scheduled += 1;
    else row.notPosted += 1;

    rows.set(name, row);
  }

  return [...rows.values()].sort(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name),
  );
}

export function buildTopClientsByPosts(
  breakdowns: EntityPostBreakdown[],
  limit = 8,
): LabeledValue[] {
  return breakdowns
    .slice(0, limit)
    .map((row) => ({ label: row.name, value: row.total }));
}

export function buildClientStatCards(
  posts: Post[],
  clients: Client[],
): StatCardItem[] {
  const currentMonth = getCurrentMonthKey();
  const activeClients = new Set(
    posts
      .filter((post) => isPostInMonth(post, currentMonth))
      .map((post) => post.client_name ?? UNKNOWN_CLIENT),
  ).size;

  const clientsNeedingFollowUp = new Set(
    posts
      .filter((post) => post.status === "Not posted")
      .map((post) => post.client_name ?? UNKNOWN_CLIENT),
  ).size;

  const avgPostsPerClient =
    clients.length > 0
      ? (Math.round((posts.length / clients.length) * 10) / 10).toString()
      : "0";

  return [
    {
      id: "client-total",
      label: "Total Clients",
      value: String(clients.length),
      description: "Brands onboarded",
      icon: Users,
    },
    {
      id: "client-active",
      label: "Active This Month",
      value: String(activeClients),
      description: "Clients with posts this month",
      icon: Activity,
    },
    {
      id: "client-avg-posts",
      label: "Avg Posts / Client",
      value: avgPostsPerClient,
      description: "All-time posts per client",
      icon: BarChart3,
    },
    {
      id: "client-follow-up",
      label: "Need Follow-up",
      value: String(clientsNeedingFollowUp),
      description: "Clients with unpublished posts",
      icon: Clock,
      trend: clientsNeedingFollowUp > 0 ? "negative" : "positive",
    },
  ];
}
