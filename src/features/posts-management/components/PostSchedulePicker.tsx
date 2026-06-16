import { PostTimeSelect } from "@/features/posts-management/components/PostTimeSelect";
import { formatPostScheduleLabel } from "@/features/posts-management/utils/postScheduleUtils";
import type { PostSchedulePickerProps } from "@/features/posts-management/types/components";

export function PostSchedulePicker({
  year,
  month,
  date,
  selectedTime,
  onTimeChange,
  disabled = false,
}: PostSchedulePickerProps) {
  return (
    <PostTimeSelect
      selectedTime={selectedTime}
      summaryLabel={formatPostScheduleLabel(year, month, date, selectedTime)}
      onTimeChange={onTimeChange}
      disabled={disabled}
    />
  );
}
