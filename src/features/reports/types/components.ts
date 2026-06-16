import type { KeyboardEvent } from "react";
import type { DateRange } from "react-day-picker";

import type { StatusKey } from "@/features/posts-management/types/types";
import type {
  ClientReportSummary,
  ReportStatCard,
  ReportStatTrend,
} from "@/features/reports/types/types";

export type ReportDateRangePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: DateRange | undefined;
  rangeLabel: string;
  onRangeChange: (range: DateRange | undefined) => void;
  onApply: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  isLoading?: boolean;
};

export type ReportStatCardsProps = {
  stats: ReportStatCard[];
};

export type ReportStatTrendProps = {
  delta: string;
  label: string;
  trend: ReportStatTrend;
};

export type ReportStatusFiltersProps = {
  options: StatusKey[];
  activeStatuses: StatusKey[];
  onToggle: (status: StatusKey) => void;
};

export type ReportsTableProps = {
  summaries: ClientReportSummary[];
  isLoading: boolean;
  hasGenerated: boolean;
  periodLabel: string;
  statusFilterOptions: StatusKey[];
  activeStatuses: StatusKey[];
  onToggleStatusFilter: (status: StatusKey) => void;
};
