import { useMemo } from "react";

import {
  TASK_STATUS_LABELS,
  TASK_STATUSES,
} from "@/features/tasks-management/constants/taskStatuses";
import type { TaskStatus } from "@/features/tasks-management/types/types";
import type { TaskStatusSelectProps } from "@/features/tasks-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TaskStatusSelect({
  value,
  onChange,
  disabled = false,
}: TaskStatusSelectProps) {
  const options = useMemo(
    () =>
      TASK_STATUSES.map((status) => ({
        value: status,
        label: TASK_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as TaskStatus);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select status"
      listTitle="Select status"
      mode="value"
    />
  );
}
