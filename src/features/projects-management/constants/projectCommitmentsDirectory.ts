import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECT_COMMITMENTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)]";

export const projectCommitmentsColumns: DirectoryTableColumn[] = [
  { label: "PROJECT" },
  { label: "SINGLE", align: "right" },
  { label: "CAROUSEL", align: "right" },
  { label: "REEL", align: "right" },
  { label: "STORY", align: "right" },
  { label: "VIDEO", align: "right" },
  { label: "TOTAL", align: "right" },
];

export const projectCommitmentsDirectoryConfig = {
  title: "Project commitments",
  description:
    "Committed single posts, carousels, reels, stories, and videos per project.",
  gridClass: PROJECT_COMMITMENTS_GRID_CLASS,
  columns: projectCommitmentsColumns,
  emptyMessage: "No projects with commitments yet.",
} as const;
