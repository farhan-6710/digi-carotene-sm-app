import type { DirectoryTableColumn } from "@/shared/types/components";

export const POSTS_TOP_CLIENTS_GRID_CLASS =
  "grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.6fr)]";

export const postsTopClientsColumns: DirectoryTableColumn[] = [
  { label: "CLIENT NAME" },
  { label: "TOTAL POSTS", align: "right" },
  { label: "TOTAL POSTED", align: "right" },
  { label: "BACKLOGS", align: "right" },
];
