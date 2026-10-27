import { useMemo } from "react";

import {
  LEAD_FOLLOW_UP_STATUS_LABELS,
  LEAD_FOLLOW_UP_STATUSES,
} from "@/features/crm/constants/leadFollowUpStatuses";
import type { LeadFollowUpStatusSelectProps } from "@/features/crm/types/components";
import type { LeadFollowUpStatus } from "@/features/crm/types/types";
import { ComboBox } from "@/shared/ui/ComboBox";

export function LeadFollowUpStatusSelect({
  value,
  onChange,
  disabled = false,
}: LeadFollowUpStatusSelectProps) {
  const options = useMemo(
    () =>
      LEAD_FOLLOW_UP_STATUSES.map((status) => ({
        value: status,
        label: LEAD_FOLLOW_UP_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) onChange(next as LeadFollowUpStatus);
      }}
      options={options}
      disabled={disabled}
      placeholder="Select status"
      listTitle="Select status"
      mode="value"
    />
  );
}
