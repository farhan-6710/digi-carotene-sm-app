import type { SocialPlatform } from "@/features/posts-management/constants/postsManagement";
import type { PostType, StatusKey } from "@/features/posts-management/types/types";
import type { PostFormValues } from "@/features/posts-management/utils/postFormUtils";

export type ProjectSelectProps = {
  id?: string;
  value: string;
  onChange: (projectId: string, projectLabel: string) => void;
  disabled?: boolean;
  preload?: boolean;
  selectedLabel?: string;
};

export type PostTypeSelectProps = {
  id?: string;
  value: PostType;
  onChange: (value: PostType) => void;
  disabled?: boolean;
};

export type PostDateTimePickerProps = {
  label: string;
  value: PostFormValues["toBePostedOn"];
  onChange: (value: PostFormValues["toBePostedOn"]) => void;
  required?: boolean;
  disabled?: boolean;
  /** Inline remove — renders an X in the date/time row. */
  onRemove?: () => void;
};

export type PostDialogFormFieldsProps = {
  values: PostFormValues;
  statusOptions: StatusKey[];
  disabled?: boolean;
  preloadOptions?: boolean;
  lockProject?: boolean;
  patchValues: (patch: Partial<PostFormValues>) => void;
};

export type AddPostsDayListProps = {
  drafts: import("@/features/posts-management/utils/postFormUtils").PostDraftDay[];
  activeDayId: string;
  disabled?: boolean;
  onSelectDay: (dayId: string) => void;
  onAddDay: () => void;
  onRequestRemoveDay: (dayId: string) => void;
};

export type PostDialogLinkFieldsProps = {
  socials: string[];
  postLinks: Record<string, string>;
  onPostLinksChange: (links: Record<string, string>) => void;
  disabled?: boolean;
};

export type PostsWeekDayCellProps = {
  year: number;
  month: number;
  dateNumber: number;
  slot: import("@/features/posts-management/types/types").Slot | undefined;
  isSelected: boolean;
  statusColors: Record<StatusKey, string>;
  statusText: Record<StatusKey, string>;
  onOpenDay: () => void;
  onOpenPost: (postId: string) => void;
};

export type DayPostsTableProps = {
  posts: import("@/features/posts-management/types/types").Post[];
  projects: import("@/features/projects-management/types/types").ProjectListItem[];
  isLoading: boolean;
  selectedClientIds: string[];
  selectedProjectIds: string[];
  onClientChange: (clientIds: string[]) => void;
  onProjectChange: (projectIds: string[]) => void;
  onOpenPost: (
    post: import("@/features/posts-management/types/types").Post,
  ) => void;
};

export type DayPostsTableRowProps = {
  post: import("@/features/posts-management/types/types").Post;
  onOpenPost: (
    post: import("@/features/posts-management/types/types").Post,
  ) => void;
};

export type PostsDaysListTableProps = {
  year: number;
  month: number;
  isLoading: boolean;
  listDateRange?: { from: Date; to?: Date };
  getSlot: (
    year: number,
    month: number,
    date: number,
  ) => import("@/features/posts-management/types/types").Slot | undefined;
};

export type PostsManagementFiltersBarProps = {
  projects: import("@/features/projects-management/types/types").ProjectListItem[];
  selectedClientIds: string[];
  selectedProjectIds: string[];
  statusFilter: import("@/features/posts-management/constants/postStatusSelect").PostStatusSelectId;
  onClientChange: (clientIds: string[]) => void;
  onProjectChange: (projectIds: string[]) => void;
  onStatusChange: (
    status: import("@/features/posts-management/constants/postStatusSelect").PostStatusSelectId,
  ) => void;
  listView: boolean;
  listDateRange: {
    isPickerOpen: boolean;
    onPickerOpenChange: (open: boolean) => void;
    pickerRange: import("react-day-picker").DateRange | undefined;
    rangeButtonLabel: string;
    isDateRangeActive: boolean;
    onPickerRangeChange: (
      range: import("react-day-picker").DateRange | undefined,
    ) => void;
    onApplyDateRange: () => void;
    onClearDateRange: () => void;
    onPickerKeyDown: (event: import("react").KeyboardEvent) => void;
    pickerError: string | null;
  };
};

export type PostsDaysListStatusMixItem = {
  status: import("@/features/posts-management/types/types").StatusKey;
  count: number;
};

export type PostsDaysListTableRowProps = {
  date: number;
  dayLabel: string;
  postCount: number;
  statusMix: PostsDaysListStatusMixItem[];
  href: string;
};

export type PostsCalendarViewToggleProps = {
  listView: boolean;
  onListViewChange: (listView: boolean) => void;
};

export type PostDetailSummaryProps = {
  post: import("@/features/posts-management/types/types").Post;
};

export type PostContentDetailsProps = {
  content: import("@/features/posts-management/utils/postContentViewUtils").PostContentView;
};

export type PostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  statusOptions: StatusKey[];
  values: PostFormValues;
  patchValues: (patch: Partial<PostFormValues>) => void;
  onSave: () => void;
  onDelete?: () => void;
};

export type PostsManagementWeeksTableProps = {
  year: number;
  month: number;
  weeks: import("@/features/posts-management/types/types").Week[];
  selectedDate: Date;
  getSlot: (
    year: number,
    month: number,
    date: number,
  ) => import("@/features/posts-management/types/types").Slot | undefined;
  onOpenDay: (year: number, month: number, date: number) => void;
  onOpenPost: (postId: string) => void;
  statusColors: Record<StatusKey, string>;
  statusText: Record<StatusKey, string>;
};

export type PostTimeSelectProps = {
  selectedTime: string;
  summaryLabel: string;
  listLabel?: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
  side?: "top" | "bottom";
  triggerPlaceholder?: string;
};

export type SocialsSelectProps = {
  value: SocialPlatform[];
  onChange: (value: SocialPlatform[]) => void;
  disabled?: boolean;
};

export type StatusSelectProps = {
  value: StatusKey;
  onChange: (value: StatusKey) => void;
  options: StatusKey[];
  disabled?: boolean;
};
