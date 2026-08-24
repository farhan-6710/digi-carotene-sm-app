import { useMemo } from "react";

import {
  LEAD_SCORE_LABELS,
  LEAD_SCORES,
} from "@/features/crm/constants/leadScores";
import type { LeadScore } from "@/features/crm/types/types";
import type { LeadScoreSelectProps } from "@/features/crm/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function LeadScoreSelect({
  value,
  onChange,
  disabled = false,
}: LeadScoreSelectProps) {
  const options = useMemo(
    () =>
      LEAD_SCORES.map((score) => ({
        value: String(score),
        label: LEAD_SCORE_LABELS[score],
      })),
    [],
  );

  return (
    <ComboBox
      value={String(value)}
      onChange={(next) => {
        if (next) {
          onChange(Number(next) as LeadScore);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder="Select score"
      listTitle="Select score"
      mode="value"
    />
  );
}
