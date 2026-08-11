import { ProductionPlanContentCard } from "@/features/production-planner/components/ProductionPlanContentCard";
import { productionPlanContentsListConfig } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanContentsListProps } from "@/features/production-planner/types/components";
import { TableLoadingState } from "@/shared/components/LoadingSpinner";

export function ProductionPlanContentsList({
  contents,
  isLoading,
  canEdit,
  onSave,
  onDuplicate,
  onDelete,
}: ProductionPlanContentsListProps) {
  return (
    <section className="w-full min-w-0 rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">
          {productionPlanContentsListConfig.title}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {productionPlanContentsListConfig.description}
        </p>
      </div>

      <div className="p-4 sm:p-5">
        {isLoading ? (
          <TableLoadingState />
        ) : contents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {productionPlanContentsListConfig.emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {contents.map((content, index) => (
              <ProductionPlanContentCard
                key={content.id}
                content={content}
                index={index}
                canEdit={canEdit}
                onSave={onSave}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
