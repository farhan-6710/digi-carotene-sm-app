import type { CustomReportKind, CustomReportPeriodId } from "../constants/customReport";
import type { AdAccountKind, GrowthPlatform } from "../types/types";

export type CustomReportFormState = {
  kind: CustomReportKind;
  platform: GrowthPlatform | AdAccountKind;
  selectedAccountIds: string[];
  periodId: CustomReportPeriodId;
  startDate: string;
  endDate: string;
};

export type CustomReportAccountOption = {
  id: string;
  label: string;
  caption: string;
  platform: GrowthPlatform | AdAccountKind;
};

export type CustomReportSectionStat = {
  label: string;
  value: string;
};

export type CustomReportTopPost = {
  caption: string;
  detail: string;
};

export type CustomReportAccountSection = {
  accountId: string;
  accountName: string;
  platformLabel: string;
  kind: CustomReportKind;
  stats: CustomReportSectionStat[];
  topPosts: CustomReportTopPost[];
  note?: string;
};

export type CustomReportDocumentData = {
  title: string;
  generatedAtLabel: string;
  periodLabel: string;
  sections: CustomReportAccountSection[];
};
