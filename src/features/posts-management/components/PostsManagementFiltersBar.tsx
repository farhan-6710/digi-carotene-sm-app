import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import type { PostsManagementFiltersBarProps } from "@/features/posts-management/types/components";
import { DateRangePicker } from "@/shared/components/DateRangePicker";

export function PostsManagementFiltersBar({
  projects,
  selectedClientIds,
  selectedProjectIds,
  statusFilter,
  onClientChange,
  onProjectChange,
  onStatusChange,
  listView,
  listDateRange,
}: PostsManagementFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:max-w-4xl">
        <ClientProjectFilters
          projects={projects}
          selectedClientIds={selectedClientIds}
          selectedProjectIds={selectedProjectIds}
          onClientChange={onClientChange}
          onProjectChange={onProjectChange}
          className="contents"
        />
        <PostStatusSelect value={statusFilter} onChange={onStatusChange} />
      </div>

      {listView ? (
        <div className="flex shrink-0 items-end lg:pb-0.5">
          <DateRangePicker
            open={listDateRange.isPickerOpen}
            onOpenChange={listDateRange.onPickerOpenChange}
            range={listDateRange.pickerRange}
            rangeLabel={listDateRange.rangeButtonLabel}
            isActive={listDateRange.isDateRangeActive}
            onRangeChange={listDateRange.onPickerRangeChange}
            onApply={listDateRange.onApplyDateRange}
            onClear={listDateRange.onClearDateRange}
            onKeyDown={listDateRange.onPickerKeyDown}
            error={listDateRange.pickerError}
          />
        </div>
      ) : null}
    </div>
  );
}
