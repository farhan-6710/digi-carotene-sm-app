import { useMemo } from "react";

import {
  LEAD_SOURCE_LABELS,
  LEAD_SOURCES,
} from "@/features/crm/constants/leadSources";
import type { LeadSource } from "@/features/crm/types/types";
import type { LeadSourceSelectProps } from "@/features/crm/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function LeadSourceSelect({
  value,
  onChange,
  disabled = false,
}: LeadSourceSelectProps) {
  const options = useMemo(
    () =>
      LEAD_SOURCES.map((source) => ({
        value: source,
        label: LEAD_SOURCE_LABELS[source],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as LeadSource);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select source"
      listTitle="Select source"
      mode="value"
    />
  );
}
