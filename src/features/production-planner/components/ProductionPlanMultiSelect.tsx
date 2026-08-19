import { Clapperboard } from "lucide-react";
import { useMemo } from "react";

import type { ProductionPlanMultiSelectProps } from "@/features/production-planner/types/components";
import { getProductionPlanDisplayLabel } from "@/features/production-planner/utils/productionPlanFormUtils";
import { fetchProductionPlans } from "@/services/productionPlansService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { MultiSelect } from "@/shared/ui/MultiSelect";

export function ProductionPlanMultiSelect({
  value,
  onChange,
  disabled = false,
  excludePlanIds = [],
  placeholder = "Select plans",
  preload = false,
}: ProductionPlanMultiSelectProps) {
  const { items: plans, isLoading, handleOpenChange } = useLazyEntityList(
    fetchProductionPlans,
    { preload },
  );

  const options = useMemo(
    () =>
      plans.map((plan) => ({
        value: plan.id,
        label: getProductionPlanDisplayLabel(plan),
        icon: <Clapperboard className="size-3.5 opacity-70" />,
      })),
    [plans],
  );

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder={placeholder}
      emptyMessage="No plans left to assign."
      excludeValues={excludePlanIds}
      onOpenChange={handleOpenChange}
    />
  );
}
