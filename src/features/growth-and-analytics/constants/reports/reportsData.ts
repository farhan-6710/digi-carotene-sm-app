import type { ReportRow, ReportType } from "../types/types";

export const DUMMY_REPORTS: ReportRow[] = [
  {
    id: "rpt-ig-content-may",
    title: "Carotene Studio — Content Performance",
    type: "content_performance",
    platform: "instagram",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    createdAt: "2026-06-02T09:30:00.000Z",
  },
  {
    id: "rpt-ig-june",
    title: "Carotene Studio — Instagram Overview",
    type: "instagram",
    platform: "instagram",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    createdAt: "2026-06-28T14:00:00.000Z",
  },
  {
    id: "rpt-fb-q2",
    title: "Carotene HQ — Facebook Overview",
    type: "facebook",
    platform: "facebook",
    periodStart: "2026-04-01",
    periodEnd: "2026-06-30",
    createdAt: "2026-07-01T11:15:00.000Z",
  },
  {
    id: "rpt-campaigns-june",
    title: "Carotene Ads — Campaign Analytics",
    type: "campaigns",
    platform: "campaigns",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    createdAt: "2026-07-02T08:45:00.000Z",
  },
  {
    id: "rpt-custom-blend",
    title: "Multi-account Custom Report",
    type: "instagram",
    platform: "instagram",
    periodStart: "2026-03-01",
    periodEnd: "2026-06-30",
    createdAt: "2026-07-05T16:20:00.000Z",
  },
];

export const reportTabs: { id: ReportType | "all"; label: string }[] = [
  { id: "all", label: "All Reports" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "campaigns", label: "Campaigns" },
  { id: "content_performance", label: "Content Performance" },
];
