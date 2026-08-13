import { useMemo, useState } from "react";

import { ProductionPlanContentApprovalFilter } from "@/features/production-planner/components/ProductionPlanContentApprovalFilter";
import { ProductionPlanContentCard } from "@/features/production-planner/components/ProductionPlanContentCard";
import {
  DEFAULT_CONTENT_APPROVAL_FILTER,
  type ContentApprovalFilterId,
} from "@/features/production-planner/constants/contentApprovalFilters";
import { productionPlanContentsListConfig } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanContentsListProps } from "@/features/production-planner/types/components";
import { filterContentsByApproval } from "@/features/production-planner/utils/contentApprovalFilterUtils";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";

export function ProductionPlanContentsList({
  contents,
  isLoading,
  canEdit,
  onSave,
  onDuplicate,
  onDelete,
}: ProductionPlanContentsListProps) {
  const [approvalFilter, setApprovalFilter] = useState<ContentApprovalFilterId>(
    DEFAULT_CONTENT_APPROVAL_FILTER,
  );

  const filteredContents = useMemo(
    () => filterContentsByApproval(contents, approvalFilter),
    [contents, approvalFilter],
  );

  const emptyMessage =
    contents.length === 0
      ? productionPlanContentsListConfig.emptyMessage
      : "No content matches this approval filter.";

  return (
    <section className="w-full min-w-0 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold">
            {productionPlanContentsListConfig.title}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {productionPlanContentsListConfig.description}
          </p>
        </div>
        <ProductionPlanContentApprovalFilter
          value={approvalFilter}
          onChange={setApprovalFilter}
          disabled={isLoading || contents.length === 0}
        />
      </div>

      <div className="p-4 sm:p-5">
        {isLoading ? (
          <TableLoadingState />
        ) : filteredContents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContents.map((content) => {
              const index = contents.findIndex((item) => item.id === content.id);
              return (
                <ProductionPlanContentCard
                  key={content.id}
                  content={content}
                  index={index >= 0 ? index : 0}
                  canEdit={canEdit}
                  onSave={onSave}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
