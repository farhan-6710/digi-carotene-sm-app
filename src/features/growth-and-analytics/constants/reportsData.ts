import type { ReportType } from "../types/types";

export const reportTabs: { id: ReportType | "all"; label: string }[] = [
  { id: "all", label: "All Reports" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "campaigns", label: "Campaigns" },
  { id: "content_performance", label: "Content Performance" },
];
