import type { ClientReportDetail } from "@/features/reports/types/types";

export function buildDummyClientReport(clientName: string): ClientReportDetail {
  return {
    clientName,
    periodLabel: "May 1 – May 31, 2026",
    totalPosts: 12,
    postedCount: 8,
    scheduledCount: 3,
    notPostedCount: 1,
    highlights: [
      "Strong posting consistency across Instagram and Facebook.",
      "Highest engagement on mid-week afternoon slots.",
      "One missed post flagged for follow-up with the client.",
    ],
    recentPosts: [
      { date: "May 28, 2026", time: "2:00 PM", status: "Posted" },
      { date: "May 26, 2026", time: "10:00 AM", status: "Posted" },
      { date: "May 24, 2026", time: "4:30 PM", status: "Scheduled" },
      { date: "May 22, 2026", time: "11:00 AM", status: "Not posted" },
    ],
  };
}
