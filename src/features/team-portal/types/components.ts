import type { StatusKey } from "@/features/posts-management/types/types";
import type {
  TeamDashboardPostItem,
  TeamNeedsAttentionItem,
  TeamTodaysPostItem,
} from "@/features/team-portal/types/types";

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

export type TeamTodaysPostsProps = {
  items: TeamTodaysPostItem[];
  isLoading: boolean;
  error: string | null;
  updatingPostId: string | null;
  onStatusChange: (postId: string, status: StatusKey) => void;
};

export type TeamNeedsAttentionListProps = {
  items: TeamNeedsAttentionItem[];
  isLoading: boolean;
  error: string | null;
};

export type TeamNeedsAttentionRowProps = {
  row: TeamNeedsAttentionItem;
};

export type TeamNeedsAttentionProps = {
  items: TeamNeedsAttentionItem[];
  isLoading: boolean;
  error: string | null;
};
