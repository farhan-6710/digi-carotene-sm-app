import { useMemo } from "react";

import {
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
} from "@/features/crm/constants/leadStatuses";
import type { LeadStatus } from "@/features/crm/types/types";
import type { LeadStatusSelectProps } from "@/features/crm/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function LeadStatusSelect({
  value,
  onChange,
  disabled = false,
}: LeadStatusSelectProps) {
  const options = useMemo(
    () =>
      LEAD_STATUSES.map((status) => ({
        value: status,
        label: LEAD_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as LeadStatus);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select status"
      listTitle="Select status"
      mode="value"
    />
  );
}
