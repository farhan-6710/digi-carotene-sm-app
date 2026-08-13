import { useMemo } from "react";

import {
  ACTIVE_STATUS_FILTERS,
  type ActiveStatusFilterId,
} from "@/shared/constants/activeStatusFilter";
import { ComboBox } from "@/shared/ui/ComboBox";

type ActiveStatusFilterProps = {
  value: ActiveStatusFilterId;
  onChange: (value: ActiveStatusFilterId) => void;
  labels: Record<ActiveStatusFilterId, string>;
  disabled?: boolean;
  placeholder?: string;
};

export function ActiveStatusFilter({
  value,
  onChange,
  labels,
  disabled = false,
  placeholder = "Filter by status",
}: ActiveStatusFilterProps) {
  const options = useMemo(
    () =>
      ACTIVE_STATUS_FILTERS.map((filter) => ({
        value: filter,
        label: labels[filter],
      })),
    [labels],
  );

  return (
    <div className="w-full sm:w-[220px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next as ActiveStatusFilterId);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder={placeholder}
        listTitle={placeholder}
        mode="value"
      />
    </div>
  );
}
