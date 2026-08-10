import { Pencil } from "lucide-react";

import { ApprovalStatusBadge } from "@/features/production-planner/components/ApprovalStatusBadge";
import { productionPlanItemsDirectoryConfig } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanItemsTableProps } from "@/features/production-planner/types/components";
import type { ProductionPlanItem } from "@/features/production-planner/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ProductionPlanItemRowProps = {
  item: ProductionPlanItem;
  canEdit: boolean;
  onEdit: (item: ProductionPlanItem) => void;
};

function ProductionPlanItemRow({
  item,
  canEdit,
  onEdit,
}: ProductionPlanItemRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/10",
        productionPlanItemsDirectoryConfig.gridClass,
      )}
    >
      <div className="min-w-0">
        {canEdit ? (
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="cursor-pointer text-left text-sm font-semibold text-primary outline-none hover:underline"
          >
            {item.item_name}
          </button>
        ) : (
          <p className="text-sm font-semibold text-foreground">
            {item.item_name}
          </p>
        )}
        {item.item_notes ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {item.item_notes}
          </p>
        ) : null}
      </div>

      <div>
        <ApprovalStatusBadge status={item.manager_approval} />
      </div>

      <div>
        <ApprovalStatusBadge status={item.shoot_incharge_approval} />
      </div>

      <div className="flex justify-end">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(item)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit item</span>
          </Button>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>
    </div>
  );
}

export function ProductionPlanItemsTable({
  items,
  isLoading,
  canEdit,
  onEdit,
}: ProductionPlanItemsTableProps) {
  return (
    <DirectoryTable
      title={productionPlanItemsDirectoryConfig.title}
      description={productionPlanItemsDirectoryConfig.description}
      gridClass={productionPlanItemsDirectoryConfig.gridClass}
      columns={[...productionPlanItemsDirectoryConfig.columns]}
      emptyMessage={productionPlanItemsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={items.length === 0}
    >
      {items.map((item) => (
        <ProductionPlanItemRow
          key={item.id}
          item={item}
          canEdit={canEdit}
          onEdit={onEdit}
        />
      ))}
    </DirectoryTable>
  );
}
