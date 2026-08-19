import { useEffect, useMemo, useRef, useState } from "react";

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
  canEditManagerApproval,
  canEditShootInchargeApproval,
  canEditClientApproval,
  lockDetails = false,
  showMutations = true,
  draftContent = null,
  draftFocusKey = 0,
  onSave,
  onDuplicate,
  onDelete,
  onDiscardDraft,
  emptyMessage: emptyMessageOverride,
}: ProductionPlanContentsListProps) {
  const draftRef = useRef<HTMLDivElement>(null);
  const [approvalFilter, setApprovalFilter] = useState<ContentApprovalFilterId>(
    DEFAULT_CONTENT_APPROVAL_FILTER,
  );

  const filteredContents = useMemo(
    () => filterContentsByApproval(contents, approvalFilter),
    [contents, approvalFilter],
  );

  useEffect(() => {
    if (!draftContent) return;
    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        draftRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    });
    return () => {
      cancelAnimationFrame(outerFrame);
      if (innerFrame) cancelAnimationFrame(innerFrame);
    };
  }, [draftContent, draftFocusKey]);

  const emptyMessage =
    contents.length === 0
      ? (emptyMessageOverride ?? productionPlanContentsListConfig.emptyMessage)
      : "No content matches this approval filter.";
  const hasVisibleContent = filteredContents.length > 0 || Boolean(draftContent);

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
        ) : !hasVisibleContent ? (
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
                  canEditManagerApproval={canEditManagerApproval}
                  canEditShootInchargeApproval={canEditShootInchargeApproval}
                  canEditClientApproval={canEditClientApproval}
                  lockDetails={lockDetails}
                  showMutations={showMutations}
                  onSave={onSave}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              );
            })}
            {draftContent ? (
              <div ref={draftRef} className="scroll-mb-6">
                <ProductionPlanContentCard
                  key={draftContent.id}
                  content={draftContent}
                  index={contents.length}
                  canEdit
                  canEditManagerApproval={canEditManagerApproval}
                  canEditShootInchargeApproval={canEditShootInchargeApproval}
                  canEditClientApproval={canEditClientApproval}
                  lockDetails={lockDetails}
                  showMutations={showMutations}
                  isDraft
                  onSave={onSave}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onDiscard={onDiscardDraft}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
