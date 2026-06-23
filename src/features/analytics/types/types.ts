export type PostActivityLevel = 0 | 1 | 2 | 3 | 4;

export type DayContribution = {
  date: string;
  completedCount: number;
  level: PostActivityLevel;
  isFuture: boolean;
};

export type ContributionWeek = {
  index: number;
  days: (DayContribution | null)[];
};

export type MonthLabel = {
  label: string;
  startColumn: number;
  endColumn: number;
};

export type ContributionSummary = {
  totalCompleted: number;
  activeDays: number;
  bestDay: { date: string; count: number };
  currentStreak: number;
  longestStreak: number;
  missedDays: number;
};

export type AnalyticsStatTrend = "positive" | "negative";

export type AnalyticsStatCard = {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: AnalyticsStatTrend;
};

export type PostsTopClient = {
  name: string;
  posts: number;
  scheduled: number;
  notPosted: number;
};

export type AnalyticsDataset = {
  posts: import("@/features/posts-management/types/types").Post[];
  clients: import("@/features/clients-management/types/types").Client[];
  teamMembers: import("@/features/team-management/types/types").TeamMember[];
  projects: import("@/features/projects-management/types/types").ProjectListItem[];
};

export type CategoryDatum = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export type LabeledValue = {
  label: string;
  value: number;
};

export type MonthlyTrendDatum = {
  month: string;
  posted: number;
  scheduled: number;
  notPosted: number;
};

export type EntityPostBreakdown = {
  id: string;
  name: string;
  meta?: string;
  total: number;
  posted: number;
  scheduled: number;
  notPosted: number;
};
