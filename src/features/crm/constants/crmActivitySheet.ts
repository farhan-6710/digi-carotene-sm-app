import type { CrmSheetActivityKind } from "@/features/crm/types/types";

export const CRM_SHEET_ACTIVITY_KIND_LABELS: Record<
  CrmSheetActivityKind,
  string
> = {
  task: "Task",
  meeting: "Meeting",
  call: "Call",
};

export const crmActivitySheetConfig = {
  openLabel: "Open activities",
  closedLabel: "Closed activities",
  emptyMessage: "No lead activities yet.",
  searchEmptyMessage: "No activities match that search.",
  openEmptyMessage: "No open activities.",
} as const;
