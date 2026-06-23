import type { ProjectPostStats } from "@/features/projects-management/utils/projectPostStatsUtils";

type ProjectProfileStatItem = {
  label: string;
  getValue: (stats: ProjectPostStats) => number;
  valueClassName?: string;
};

export const projectProfileStatItems: ProjectProfileStatItem[] = [
  { label: "Total posts", getValue: (stats) => stats.total },
  {
    label: "Posted",
    getValue: (stats) => stats.posted,
    valueClassName: "text-status-posted",
  },
  {
    label: "Scheduled",
    getValue: (stats) => stats.scheduled,
    valueClassName: "text-status-scheduled",
  },
  {
    label: "Not posted",
    getValue: (stats) => stats.notPosted,
    valueClassName: "text-status-not-posted",
  },
];
