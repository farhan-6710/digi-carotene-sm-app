import { useMemo } from "react";

import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITIES,
} from "@/features/tasks-management/constants/taskPriorities";
import type { TaskPriority } from "@/features/tasks-management/types/types";
import type { TaskPrioritySelectProps } from "@/features/tasks-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TaskPrioritySelect({
  value,
  onChange,
  disabled = false,
}: TaskPrioritySelectProps) {
  const options = useMemo(
    () =>
      TASK_PRIORITIES.map((priority) => ({
        value: priority,
        label: TASK_PRIORITY_LABELS[priority],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as TaskPriority);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select priority"
      listTitle="Select priority"
      mode="value"
    />
  );
}
