import type { StatusKey } from "@/features/posts-management/types/types";

export type ReportDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type ReportPostRow = {
  id: string;
  clientName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: StatusKey;
  postedDate: string | null;
  postedTime: string | null;
  clientTotalPosts: number;
  clientPostedCount: number;
};

export type ClientReportSummary = {
  clientName: string;
  totalPosts: number;
  postedCount: number;
  scheduledCount: number;
  notPostedCount: number;
  posts: ReportPostRow[];
};

export type ReportStatTrend = "positive" | "negative";

export type ReportStatCard = {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: ReportStatTrend;
};

export type ClientReportDetail = {
  clientName: string;
  periodLabel: string;
  totalPosts: number;
  postedCount: number;
  scheduledCount: number;
  notPostedCount: number;
  highlights: string[];
  recentPosts: {
    date: string;
    time: string;
    status: StatusKey;
  }[];
};
