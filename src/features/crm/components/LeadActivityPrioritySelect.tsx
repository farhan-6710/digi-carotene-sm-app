import { useMemo } from "react";

import {
  LEAD_ACTIVITY_PRIORITIES,
  LEAD_ACTIVITY_PRIORITY_LABELS,
} from "@/features/crm/constants/leadActivityStatuses";
import type { LeadActivityPriority } from "@/features/crm/types/types";
import { ComboBox } from "@/shared/ui/ComboBox";

type LeadActivityPrioritySelectProps = {
  value: LeadActivityPriority;
  onChange: (priority: LeadActivityPriority) => void;
  disabled?: boolean;
};

export function LeadActivityPrioritySelect({
  value,
  onChange,
  disabled = false,
}: LeadActivityPrioritySelectProps) {
  const options = useMemo(
    () =>
      LEAD_ACTIVITY_PRIORITIES.map((priority) => ({
        value: priority,
        label: LEAD_ACTIVITY_PRIORITY_LABELS[priority],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) onChange(next as LeadActivityPriority);
      }}
      options={options}
      disabled={disabled}
      placeholder="Select priority"
      listTitle="Select priority"
      mode="value"
    />
  );
}
