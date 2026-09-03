import { useMemo } from "react";

import {
  TASK_STATUS_FILTERS,
  TASK_STATUS_FILTER_LABELS,
  type TaskStatusFilterId,
} from "@/features/tasks-management/constants/taskStatusFilter";
import type { TaskStatusFilterProps } from "@/features/tasks-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TaskStatusFilter({
  value,
  onChange,
  disabled = false,
}: TaskStatusFilterProps) {
  const options = useMemo(
    () =>
      TASK_STATUS_FILTERS.map((filter) => ({
        value: filter,
        label: TASK_STATUS_FILTER_LABELS[filter],
      })),
    [],
  );

  return (
    <div className="w-full sm:w-[220px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next as TaskStatusFilterId);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder="Filter by status"
        listTitle="Filter by status"
        mode="value"
      />
    </div>
  );
}
