import type { LucideIcon } from "lucide-react";

export type SparklinePoint = {
  value: number;
};

export type StatCardTrend = "positive" | "negative";

export type StatCardItem = {
  id: string;
  label: string;
  value: string;
  description?: string;
  delta?: string;
  deltaLabel?: string;
  trend?: StatCardTrend;
  sparklineData?: SparklinePoint[];
  sparklineColor?: string;
  href?: string;
  icon: LucideIcon;
};
