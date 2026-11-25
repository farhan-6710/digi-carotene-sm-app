import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { PostStatusSelect } from "@/features/posts-management/components/PostStatusSelect";
import { POST_STATUS_SELECT_ALL } from "@/features/posts-management/constants/postStatusSelect";
import type { PostsManagementFiltersBarProps } from "@/features/posts-management/types/components";
import { DateRangePicker } from "@/shared/components/DateRangePicker";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";

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
  const activeCount =
    selectedClientIds.length +
    selectedProjectIds.length +
    (statusFilter !== POST_STATUS_SELECT_ALL ? 1 : 0) +
    (listView && listDateRange.isDateRangeActive ? 1 : 0);

  const filterCount = 3 + (listView ? 1 : 0);

  return (
    <ListingFiltersChrome
      title="Posting filters"
      description="Filter the calendar or list by client, project, and status."
      activeCount={activeCount}
      filterCount={filterCount}
      className="w-full"
    >
      <ClientProjectFilters
        projects={projects}
        selectedClientIds={selectedClientIds}
        selectedProjectIds={selectedProjectIds}
        onClientChange={onClientChange}
        onProjectChange={onProjectChange}
        className="grid w-full min-w-0 gap-3 md:max-w-xl md:grid-cols-2"
      />
      <PostStatusSelect value={statusFilter} onChange={onStatusChange} />
      {listView ? (
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
      ) : null}
    </ListingFiltersChrome>
  );
}
