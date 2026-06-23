import type { SocialPlatform } from "@/features/posts-management/constants/postsManagement";
import type { StatusKey } from "@/features/posts-management/types/types";
import type { PostFormValues } from "@/features/posts-management/utils/postFormUtils";

export type ProjectSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export type ClientSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export type PostDateTimePickerProps = {
  label: string;
  value: PostFormValues["toBePostedOn"];
  onChange: (value: PostFormValues["toBePostedOn"]) => void;
  required?: boolean;
  disabled?: boolean;
};

export type PostDialogFormFieldsProps = {
  values: PostFormValues;
  statusOptions: StatusKey[];
  disabled?: boolean;
  patchValues: (patch: Partial<PostFormValues>) => void;
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
  onAdd: () => void;
  onEdit: (postId: string) => void;
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

export type PostSchedulePickerProps = {
  year: number;
  month: number;
  date: number;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
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
  onAdd: (year: number, month: number, date: number) => void;
  onEdit: (year: number, month: number, date: number, postId: string) => void;
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
