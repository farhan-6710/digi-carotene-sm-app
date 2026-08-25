import { Plus } from "lucide-react";

import { SubtasksTableRow } from "@/features/tasks-management/components/SubtasksTableRow";
import { subtasksDirectoryConfig } from "@/features/tasks-management/constants/subtasksDirectory";
import type { SubtasksTableProps } from "@/features/tasks-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";

export function SubtasksTable({
  subtasks,
  isLoading,
  canEditSubtask,
  onEditSubtask,
  canAdd,
  onAddSubtask,
  buildDetailPath,
}: SubtasksTableProps) {
  return (
    <DirectoryTable
      title={subtasksDirectoryConfig.title}
      description={subtasksDirectoryConfig.description}
      gridClass={subtasksDirectoryConfig.gridClass}
      columns={subtasksDirectoryConfig.columns}
      emptyMessage={subtasksDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={subtasks.length === 0}
      headerAside={
        canAdd ? (
          <Button
            type="button"
            onClick={onAddSubtask}
            className="rounded-full shadow-sm"
            disabled={isLoading}
          >
            <Plus className="mr-2 size-4" />
            Add Subtask
          </Button>
        ) : null
      }
    >
      {subtasks.map((subtask) => (
        <SubtasksTableRow
          key={subtask.id}
          subtask={subtask}
          canEdit={canEditSubtask(subtask)}
          onEdit={onEditSubtask}
          detailPath={buildDetailPath?.(subtask.id)}
        />
      ))}
    </DirectoryTable>
  );
}
