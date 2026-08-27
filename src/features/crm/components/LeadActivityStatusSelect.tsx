import { useMemo } from "react";

import {
  LEAD_ACTIVITY_STATUS_LABELS,
  LEAD_ACTIVITY_STATUSES,
} from "@/features/crm/constants/leadActivityStatuses";
import type { LeadActivityStatus } from "@/features/crm/types/types";
import { ComboBox } from "@/shared/ui/ComboBox";

type LeadActivityStatusSelectProps = {
  value: LeadActivityStatus;
  onChange: (status: LeadActivityStatus) => void;
  disabled?: boolean;
};

export function LeadActivityStatusSelect({
  value,
  onChange,
  disabled = false,
}: LeadActivityStatusSelectProps) {
  const options = useMemo(
    () =>
      LEAD_ACTIVITY_STATUSES.map((status) => ({
        value: status,
        label: LEAD_ACTIVITY_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) onChange(next as LeadActivityStatus);
      }}
      options={options}
      disabled={disabled}
      placeholder="Select status"
      listTitle="Select status"
      mode="value"
    />
  );
}
