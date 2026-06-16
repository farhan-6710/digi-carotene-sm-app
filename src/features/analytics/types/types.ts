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
  missed: number;
};

export type AnalyticsStatGridItem = {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend?: AnalyticsStatTrend;
};
