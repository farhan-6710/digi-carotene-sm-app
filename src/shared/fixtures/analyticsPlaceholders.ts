import type { AnalyticsStatGridItem } from "@/features/analytics/types/types";

export const clientAnalyticsStats: AnalyticsStatGridItem[] = [
  {
    label: "Total Clients",
    value: "24",
    delta: "+3",
    deltaLabel: "this quarter",
    trend: "positive",
  },
  {
    label: "Active This Month",
    value: "18",
    delta: "+2",
    deltaLabel: "vs last month",
    trend: "positive",
  },
  {
    label: "Avg Posts per Client",
    value: "6.4",
    delta: "+0.8",
    deltaLabel: "vs last month",
    trend: "positive",
  },
  {
    label: "Clients Needing Follow-up",
    value: "3",
    delta: "-1",
    deltaLabel: "from last week",
    trend: "positive",
  },
];

export const employeeAnalyticsStats: AnalyticsStatGridItem[] = [
  {
    label: "Team Members",
    value: "12",
    delta: "+2",
    deltaLabel: "this quarter",
    trend: "positive",
  },
  {
    label: "Active Assignments",
    value: "31",
    delta: "+5",
    deltaLabel: "vs last month",
    trend: "positive",
  },
  {
    label: "Avg Clients per Team Member",
    value: "2.6",
    delta: "+0.3",
    deltaLabel: "vs last month",
    trend: "positive",
  },
  {
    label: "Unassigned Clients",
    value: "4",
    delta: "-2",
    deltaLabel: "from last month",
    trend: "positive",
  },
];
