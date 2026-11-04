import { useMemo } from "react";

import { TASKS_ALL_PROJECTS } from "@/features/tasks-management/constants/taskProjectFilter";
import type { TaskProjectFilterProps } from "@/features/tasks-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TaskProjectFilter({
  value,
  onChange,
  projects,
  disabled = false,
}: TaskProjectFilterProps) {
  const options = useMemo(
    () => [{ value: TASKS_ALL_PROJECTS, label: "All projects" }, ...projects],
    [projects],
  );

  return (
    <div className="w-full min-w-0 sm:w-[220px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) onChange(next);
        }}
        options={options}
        disabled={disabled}
        placeholder="Filter by project"
        listTitle="Filter by project"
        emptyMessage="No projects in this list."
        noMatchMessage="No matching projects found."
        mode="value"
      />
    </div>
  );
}
