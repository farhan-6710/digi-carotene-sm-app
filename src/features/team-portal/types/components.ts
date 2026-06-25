import type { StatusKey } from "@/features/posts-management/types/types";
import type { TeamDashboardPostItem } from "@/features/team-portal/types/types";

export type TeamDashboardPostListProps = {
  title: string;
  items: TeamDashboardPostItem[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
  onStatusChange: (postId: string, status: StatusKey) => void;
  updatingPostId: string | null;
};

export type TeamDashboardPostRowProps = {
  row: TeamDashboardPostItem;
  onStatusChange: (postId: string, status: StatusKey) => void;
  isUpdating: boolean;
};
