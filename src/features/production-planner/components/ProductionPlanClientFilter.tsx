import { useMemo } from "react";

import { PRODUCTION_PLANNER_ALL_CLIENTS } from "@/features/production-planner/constants/routes";
import type { ProductionPlanClientFilterProps } from "@/features/production-planner/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProductionPlanClientFilter({
  value,
  onChange,
  clients,
  disabled = false,
}: ProductionPlanClientFilterProps) {
  const options = useMemo(
    () => [
      { value: PRODUCTION_PLANNER_ALL_CLIENTS, label: "All clients" },
      ...clients,
    ],
    [clients],
  );

  return (
    <div className="w-full sm:w-[220px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder="Filter by client"
        listTitle="Filter by client"
        emptyMessage="No clients available."
        noMatchMessage="No matching clients found."
        mode="value"
      />
    </div>
  );
}
