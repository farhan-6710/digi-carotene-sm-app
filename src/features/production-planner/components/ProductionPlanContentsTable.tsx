import { Pencil } from "lucide-react";

import { ApprovalStatusBadge } from "@/features/production-planner/components/ApprovalStatusBadge";
import { productionPlanContentsDirectoryConfig } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanContentsTableProps } from "@/features/production-planner/types/components";
import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ProductionPlanContentRowProps = {
  content: ProductionPlanContent;
  canEdit: boolean;
  onEdit: (content: ProductionPlanContent) => void;
};

function ProductionPlanContentRow({
  content,
  canEdit,
  onEdit,
}: ProductionPlanContentRowProps) {
  return (
    <div
      className={cn(
        "grid items-center transition-colors hover:bg-muted/10 divide-x divide-border px-6 py-4",
        productionPlanContentsDirectoryConfig.gridClass,
      )}
    >
      <div className="min-w-0 pr-4">
        {canEdit ? (
          <button
            type="button"
            onClick={() => onEdit(content)}
            className="cursor-pointer text-left text-sm font-semibold text-primary outline-none hover:underline"
          >
            {content.item_name}
          </button>
        ) : (
          <p className="text-sm font-semibold text-foreground">
            {content.item_name}
          </p>
        )}
        {content.item_notes ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {content.item_notes}
          </p>
        ) : null}
      </div>

      <div className="pl-4">
        <ApprovalStatusBadge status={content.manager_approval} />
      </div>

      <div className="pl-4">
        <ApprovalStatusBadge status={content.shoot_incharge_approval} />
      </div>

      <div className="flex justify-end pl-4">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(content)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit content</span>
          </Button>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>
    </div>
  );
}

export function ProductionPlanContentsTable({
  contents,
  isLoading,
  canEdit,
  onEdit,
}: ProductionPlanContentsTableProps) {
  return (
    <DirectoryTable
      title={productionPlanContentsDirectoryConfig.title}
      description={productionPlanContentsDirectoryConfig.description}
      gridClass={productionPlanContentsDirectoryConfig.gridClass}
      columns={[...productionPlanContentsDirectoryConfig.columns]}
      emptyMessage={productionPlanContentsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={contents.length === 0}
    >
      {contents.map((content) => (
        <ProductionPlanContentRow
          key={content.id}
          content={content}
          canEdit={canEdit}
          onEdit={onEdit}
        />
      ))}
    </DirectoryTable>
  );
}
