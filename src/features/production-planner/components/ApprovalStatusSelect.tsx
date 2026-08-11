import { useMemo } from "react";

import {
  PRODUCTION_PLAN_APPROVAL_STATUSES,
  PRODUCTION_PLAN_APPROVAL_STATUS_LABELS,
} from "@/features/production-planner/constants/approvalStatus";
import type { ApprovalStatusSelectProps } from "@/features/production-planner/types/components";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ApprovalStatusSelect({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = "Select status",
  listTitle = "Select approval status",
}: ApprovalStatusSelectProps) {
  const options = useMemo(
    () =>
      PRODUCTION_PLAN_APPROVAL_STATUSES.map((status) => ({
        value: status,
        label: PRODUCTION_PLAN_APPROVAL_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <ComboBox
      id={id}
      value={value}
      onChange={(next) => {
        if (next) {
          onChange(next as ProductionPlanApprovalStatus);
        }
      }}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
      listTitle={listTitle}
      mode="value"
    />
  );
}
