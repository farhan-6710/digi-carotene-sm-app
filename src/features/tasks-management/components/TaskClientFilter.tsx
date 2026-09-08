import { useMemo } from "react";

import { TASKS_ALL_CLIENTS } from "@/features/tasks-management/constants/taskClientFilter";
import type { TaskClientFilterProps } from "@/features/tasks-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TaskClientFilter({
  value,
  onChange,
  clients,
  disabled = false,
}: TaskClientFilterProps) {
  const options = useMemo(
    () => [{ value: TASKS_ALL_CLIENTS, label: "All clients" }, ...clients],
    [clients],
  );

  return (
    <div className="w-full min-w-0 sm:w-[200px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) onChange(next);
        }}
        options={options}
        disabled={disabled}
        placeholder="Filter by client"
        listTitle="Filter by client"
        emptyMessage="No clients in this list."
        noMatchMessage="No matching clients found."
        mode="value"
      />
    </div>
  );
}
