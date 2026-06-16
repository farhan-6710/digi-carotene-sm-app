import { format, parseISO } from "date-fns";

import type { Post, StatusKey } from "@/features/posts-management/types/types";
import { comparePostTimes } from "@/features/posts-management/utils/postScheduleUtils";

import type { ClientReportSummary, ReportPostRow } from "../types/types";

function countByStatus(posts: Post[], status: StatusKey): number {
  return posts.filter((post) => post.status === status).length;
}

export function buildClientReportSummaries(posts: Post[]): ClientReportSummary[] {
  const postsByClient = new Map<string, Post[]>();

  for (const post of posts) {
    const clientPosts = postsByClient.get(post.client_name) ?? [];
    clientPosts.push(post);
    postsByClient.set(post.client_name, clientPosts);
  }

  const summaries = Array.from(postsByClient.entries()).map(
    ([clientName, clientPosts]) => {
      const postedCount = countByStatus(clientPosts, "Posted");
      const scheduledCount = countByStatus(clientPosts, "Scheduled");
      const notPostedCount = countByStatus(clientPosts, "Not posted");
      const clientTotalPosts = clientPosts.length;

      const rows: ReportPostRow[] = clientPosts
        .slice()
        .sort((a, b) => {
          const dateCompare = a.scheduled_date.localeCompare(b.scheduled_date);
          if (dateCompare !== 0) {
            return dateCompare;
          }

          return comparePostTimes(a.scheduled_time, b.scheduled_time);
        })
        .map((post) => ({
          id: post.id,
          clientName: post.client_name,
          scheduledDate: post.scheduled_date,
          scheduledTime: post.scheduled_time,
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
