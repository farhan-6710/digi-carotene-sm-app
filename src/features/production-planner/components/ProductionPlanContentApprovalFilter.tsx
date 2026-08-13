import { useMemo } from "react";

import {
  CONTENT_APPROVAL_FILTERS,
  CONTENT_APPROVAL_FILTER_LABELS,
  type ContentApprovalFilterId,
} from "@/features/production-planner/constants/contentApprovalFilters";
import type { ProductionPlanContentApprovalFilterProps } from "@/features/production-planner/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProductionPlanContentApprovalFilter({
  value,
  onChange,
  disabled = false,
}: ProductionPlanContentApprovalFilterProps) {
  const options = useMemo(
    () =>
      CONTENT_APPROVAL_FILTERS.map((filter) => ({
        value: filter,
        label: CONTENT_APPROVAL_FILTER_LABELS[filter],
      })),
    [],
  );

  return (
    <div className="w-full sm:w-[260px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next as ContentApprovalFilterId);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder="Filter by approval"
        listTitle="Filter by approval"
        mode="value"
      />
    </div>
  );
}
