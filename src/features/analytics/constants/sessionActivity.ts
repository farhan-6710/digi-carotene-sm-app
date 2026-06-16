import type {
  AnalyticsStatCard,
  ContributionSummary,
  ContributionWeek,
  DayContribution,
  MonthLabel,
} from "@/features/analytics/types/types";
import { getPostActivityLevel } from "@/features/analytics/utils/postActivityLevels";

export const CONTRIBUTION_YEAR = 2026;
export const MAX_DAILY_POSTS = 8;

export const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const legendItems = [
  { level: 0, className: "bg-status-muted" },
  { level: 1, className: "bg-contrib-1" },
  { level: 2, className: "bg-contrib-2" },
  { level: 3, className: "bg-contrib-3" },
  { level: 4, className: "bg-contrib-4" },
] as const;

function formatDateKey(year: number, month: number, day: number): string {
  const paddedMonth = String(month + 1).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
}

function seededValue(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function generateCompletedCount(date: Date): number {
  const dayOfWeek = date.getDay();
  const month = date.getMonth();
  const day = date.getDate();
  const seed = date.getFullYear() * 10000 + (month + 1) * 100 + day;
  const random = seededValue(seed);

  if (month === 7 && day >= 10 && day <= 18) {
    return random > 0.55 ? 0 : 1;
  }

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    if (random < 0.08) {
      return 0;
    }

    if (random < 0.35) {
      return Math.floor(random * 3) + 1;
    }

    return Math.floor(random * 5) + 3;
  }

  if (random < 0.04) {
    return 0;
  }

  if (random < 0.2) {
    return Math.floor(random * 4) + 1;
  }

  if (random < 0.55) {
    return Math.floor(random * 3) + 4;
  }

  return Math.floor(random * 3) + 6;
}

function buildDailyCountsForYear(
  year: number,
  endMonth: number,
  endDay: number,
) {
  const counts: Record<string, number> = {};
  const today = new Date(year, endMonth, endDay);

  for (let month = 0; month < 12; month += 1) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);

      if (date > today) {
        continue;
      }

      const dateKey = formatDateKey(year, month, day);
      counts[dateKey] = generateCompletedCount(date);
    }
  }

  return counts;
}

function buildDailyCounts(): Record<string, number> {
  return buildDailyCountsForYear(CONTRIBUTION_YEAR, 4, 27);
}

export const dailyContributionCounts = buildDailyCounts();
export const priorYearDailyCounts = buildDailyCountsForYear(
  CONTRIBUTION_YEAR - 1,
  4,
  27,
);

function buildDayContribution(date: Date, isFuture: boolean): DayContribution {
  const dateKey = formatDateKey(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const completedCount = isFuture ? 0 : (dailyContributionCounts[dateKey] ?? 0);

  return {
    date: dateKey,
    completedCount,
    level: isFuture ? 0 : getPostActivityLevel(completedCount),
    isFuture,
  };
}

export function buildContributionWeeks(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const today = new Date(CONTRIBUTION_YEAR, 4, 27);
  const yearStart = new Date(CONTRIBUTION_YEAR, 0, 1);
  const yearEnd = new Date(CONTRIBUTION_YEAR, 11, 31);

  const gridStart = new Date(yearStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const cursor = new Date(gridStart);
  let weekIndex = 0;

  while (cursor <= yearEnd || cursor.getDay() !== 0) {
    const days: (DayContribution | null)[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const inYear =
        cursor.getFullYear() === CONTRIBUTION_YEAR &&
        cursor >= yearStart &&
        cursor <= yearEnd;

      if (inYear) {
        days.push(buildDayContribution(cursor, cursor > today));
      } else {
        days.push(null);
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push({ index: weekIndex, days });
    weekIndex += 1;

    if (cursor > yearEnd && cursor.getDay() === 0) {
      break;
    }
  }

  return weeks;
}

export function buildMonthLabels(weeks: ContributionWeek[]): MonthLabel[] {
  const monthRanges = new Map<number, { min: number; max: number }>();

  weeks.forEach((week, columnIndex) => {
    for (const day of week.days) {
      if (!day) {
        continue;
      }

      const [, month] = day.date.split("-").map(Number);
      const existing = monthRanges.get(month);

      if (!existing) {
        monthRanges.set(month, { min: columnIndex, max: columnIndex });
        continue;
      }

      existing.min = Math.min(existing.min, columnIndex);
      existing.max = Math.max(existing.max, columnIndex);
    }
  });

  return Array.from(monthRanges.entries())
    .sort(([monthA], [monthB]) => monthA - monthB)
    .map(([month, range]) => ({
      label: monthLabels[month - 1],
      startColumn: range.min,
      endColumn: range.max,
    }));
}

function sumCounts(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

function countActiveDays(counts: Record<string, number>): number {
  return Object.values(counts).filter((count) => count > 0).length;
}

function countMissedDays(counts: Record<string, number>): number {
  return Object.values(counts).filter((count) => count === 0).length;
}

function formatPercentChange(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }

  const change = ((current - previous) / previous) * 100;
  const rounded =
    Math.abs(change) >= 10 ? change.toFixed(0) : change.toFixed(1);

  if (Number(rounded) > 0) {
    return `+${rounded}%`;
  }

  if (Number(rounded) < 0) {
    return `${rounded}%`;
  }

  return "0%";
}

function formatDayChange(current: number, previous: number): string {
  const change = current - previous;

  if (change > 0) {
    return `+${change}`;
  }

  if (change < 0) {
    return `${change}`;
  }

  return "0";
}

function getStreakEndingOn(
  counts: Record<string, number>,
  endDateKey: string,
): number {
  const sortedDates = Object.keys(counts).sort();
  const endIndex = sortedDates.indexOf(endDateKey);

  if (endIndex === -1) {
    return 0;
  }

  let streak = 0;

  for (let index = endIndex; index >= 0; index -= 1) {
    if ((counts[sortedDates[index]] ?? 0) > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function buildSummary(): ContributionSummary {
  const entries = Object.entries(dailyContributionCounts);
  const totalCompleted = entries.reduce((sum, [, count]) => sum + count, 0);
  const activeDays = entries.filter(([, count]) => count > 0).length;

  const bestDay = entries.reduce(
    (best, [date, count]) => (count > best.count ? { date, count } : best),
    { date: entries[0]?.[0] ?? "", count: entries[0]?.[1] ?? 0 },
  );

  const sortedDates = entries
    .map(([date]) => date)
    .sort((a, b) => a.localeCompare(b));

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  for (const date of sortedDates) {
    if ((dailyContributionCounts[date] ?? 0) > 0) {
      streak += 1;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  for (let index = sortedDates.length - 1; index >= 0; index -= 1) {
    if ((dailyContributionCounts[sortedDates[index]] ?? 0) > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    totalCompleted,
    activeDays,
    bestDay,
    currentStreak,
    longestStreak,
    missedDays: entries.filter(([, count]) => count === 0).length,
  };
}

function buildAnalyticsStats(
  summary: ContributionSummary,
): AnalyticsStatCard[] {
  const priorTotal = sumCounts(priorYearDailyCounts);
  const priorActiveDays = countActiveDays(priorYearDailyCounts);
  const priorMissedDays = countMissedDays(priorYearDailyCounts);
  const lastMonthStreak = getStreakEndingOn(
    dailyContributionCounts,
    `${CONTRIBUTION_YEAR}-04-30`,
  );

  return [
    {
      label: "Posts Published",
      value: summary.totalCompleted.toLocaleString(),
      delta: formatPercentChange(summary.totalCompleted, priorTotal),
      deltaLabel: "vs last year",
      trend: summary.totalCompleted >= priorTotal ? "positive" : "negative",
    },
    {
      label: "Active Posting Days",
      value: summary.activeDays.toLocaleString(),
      delta: formatDayChange(summary.activeDays, priorActiveDays),
      deltaLabel: "vs last year",
      trend: summary.activeDays >= priorActiveDays ? "positive" : "negative",
    },
    {
      label: "Current Streak",
      value: `${summary.currentStreak} days`,
      delta: formatDayChange(summary.currentStreak, lastMonthStreak),
      deltaLabel: "vs last month",
      trend: summary.currentStreak >= lastMonthStreak ? "positive" : "negative",
    },
    {
      label: "Missed Post Days",
      value: summary.missedDays.toLocaleString(),
      delta: formatDayChange(summary.missedDays, priorMissedDays),
      deltaLabel: "from last year",
      trend: summary.missedDays <= priorMissedDays ? "positive" : "negative",
    },
  ];
}

export const contributionWeeks = buildContributionWeeks();
export const contributionMonthLabels = buildMonthLabels(contributionWeeks);
export const contributionSummary = buildSummary();
export const analyticsStats = buildAnalyticsStats(contributionSummary);
