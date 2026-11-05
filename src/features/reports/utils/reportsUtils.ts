import { format, parseISO } from "date-fns";

import type { Post, StatusKey } from "@/features/posts-management/types/types";
import { comparePostTimes } from "@/features/posts-management/utils/postScheduleUtils";

import type { ClientReportSummary, ReportPostRow, ReportStatCard } from "../types/types";

function countByStatus(posts: Post[], status: StatusKey): number {
  return posts.filter((post) => post.status === status).length;
}

export function buildClientReportSummaries(posts: Post[]): ClientReportSummary[] {
  const postsByClient = new Map<string, Post[]>();

  for (const post of posts) {
    const clientName = post.client_name ?? "Unknown client";
    const clientPosts = postsByClient.get(clientName) ?? [];
    clientPosts.push(post);
    postsByClient.set(clientName, clientPosts);
  }

  const summaries = Array.from(postsByClient.entries()).map(
    ([clientName, clientPosts]) => {
      const postedCount = countByStatus(clientPosts, "posted");
      const scheduledCount = countByStatus(clientPosts, "scheduled");
      const notPostedCount = countByStatus(clientPosts, "editing");
      const clientTotalPosts = clientPosts.length;

      const rows: ReportPostRow[] = clientPosts
        .slice()
        .sort((a, b) => {
          const dateCompare = a.to_be_posted_date.localeCompare(b.to_be_posted_date);
          if (dateCompare !== 0) {
            return dateCompare;
          }

          return comparePostTimes(a.to_be_posted_time, b.to_be_posted_time);
        })
        .map((post) => ({
          id: post.id,
          clientName: post.client_name ?? clientName,
          toBePostedDate: post.to_be_posted_date,
          toBePostedTime: post.to_be_posted_time,
          status: post.status,
          postedDate: post.posted_date,
          postedTime: post.posted_time,
          clientTotalPosts,
          clientPostedCount: postedCount,
        }));

      return {
        clientName,
        totalPosts: clientTotalPosts,
        postedCount,
        scheduledCount,
        notPostedCount,
        posts: rows,
      };
    },
  );

  return summaries.sort((a, b) => {
    if (b.postedCount !== a.postedCount) {
      return b.postedCount - a.postedCount;
    }

    if (b.totalPosts !== a.totalPosts) {
      return b.totalPosts - a.totalPosts;
    }

    return a.clientName.localeCompare(b.clientName);
  });
}

export function flattenReportRows(
  summaries: ClientReportSummary[],
): ReportPostRow[] {
  return summaries.flatMap((summary) => summary.posts);
}

export function formatReportTableDate(dateValue: string): string {
  return format(parseISO(dateValue), "MMM d, yyyy");
}

export function formatPostedOn(
  postedDate: string | null,
  postedTime: string | null,
): string {
  if (!postedDate || !postedTime) {
    return "—";
  }

  return `${formatReportTableDate(postedDate)} · ${postedTime}`;
}

export function encodeClientReportId(clientName: string): string {
  return encodeURIComponent(clientName);
}

export function decodeClientReportId(clientId: string): string {
  return decodeURIComponent(clientId);
}

export function buildReportStatsFromSummaries(
  summaries: ClientReportSummary[],
): {
  clients: number;
  totalPosts: number;
  posted: number;
  scheduled: number;
  notPosted: number;
} {
  return summaries.reduce(
    (acc, summary) => ({
      clients: acc.clients + 1,
      totalPosts: acc.totalPosts + summary.totalPosts,
      posted: acc.posted + summary.postedCount,
      scheduled: acc.scheduled + summary.scheduledCount,
      notPosted: acc.notPosted + summary.notPostedCount,
    }),
    {
      clients: 0,
      totalPosts: 0,
      posted: 0,
      scheduled: 0,
      notPosted: 0,
    },
  );
}

const EMPTY_REPORT_STAT_CARDS: ReportStatCard[] = [
  {
    label: "Clients in range",
    value: "—",
    delta: "Select a date range",
    deltaLabel: "to view totals",
    trend: "positive",
  },
  {
    label: "Total posts",
    value: "—",
    delta: "—",
    deltaLabel: "in selected range",
    trend: "positive",
  },
  {
    label: "Posted",
    value: "—",
    delta: "—",
    deltaLabel: "completed posts",
    trend: "positive",
  },
  {
    label: "Scheduled",
    value: "—",
    delta: "—",
    deltaLabel: "upcoming posts",
    trend: "positive",
  },
];

export function buildReportStatCards(
  summaries: ClientReportSummary[],
  hasGenerated: boolean,
  periodLabel: string,
): ReportStatCard[] {
  if (!hasGenerated) {
    return EMPTY_REPORT_STAT_CARDS;
  }

  const totals = buildReportStatsFromSummaries(summaries);

  return [
    {
      label: "Clients in range",
      value: String(totals.clients),
      delta: periodLabel,
      deltaLabel: "selected period",
      trend: "positive",
    },
    {
      label: "Total posts",
      value: String(totals.totalPosts),
      delta: `${totals.posted} posted`,
      deltaLabel: "in this report",
      trend: "positive",
    },
    {
      label: "Posted",
      value: String(totals.posted),
      delta: `${totals.notPosted} editing`,
      deltaLabel: "remaining",
      trend: totals.posted >= totals.notPosted ? "positive" : "negative",
    },
    {
      label: "Scheduled",
      value: String(totals.scheduled),
      delta: `${totals.totalPosts} total`,
      deltaLabel: "posts tracked",
      trend: "positive",
    },
  ];
}
