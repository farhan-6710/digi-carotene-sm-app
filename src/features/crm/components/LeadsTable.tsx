import { useMemo } from "react";

import { LeadFollowUpFilterSelect } from "@/features/crm/components/LeadFollowUpFilterSelect";
import { LeadMonthFilter } from "@/features/crm/components/LeadMonthFilter";
import { LeadSortSelect } from "@/features/crm/components/LeadSortSelect";
import { LeadsTableRow } from "@/features/crm/components/LeadsTableRow";
import { DEFAULT_LEAD_FOLLOW_UP_FILTER } from "@/features/crm/constants/leadFollowUpFilters";
import { LEAD_MONTH_FILTER_ALL } from "@/features/crm/constants/leadSort";
import {
  LEADS_BULK_GRID_CLASS,
  leadsDirectoryColumns,
  leadsDirectoryConfig,
} from "@/features/crm/constants/leadsDirectory";
import type { LeadsTableProps } from "@/features/crm/types/components";
import { getListingFollowUp } from "@/features/crm/utils/leadFollowUpFilterUtils";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function LeadsTable({
  leads,
  followUpsByLeadId,
  isLoading,
  canEdit,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  isSavingFollowUp = false,
  onEditLead,
  onUpdateFollowUpStatus,
  onRescheduleFollowUp,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
  monthFilter,
  onMonthFilterChange,
  followUpFilter,
  onFollowUpFilterChange,
}: LeadsTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const hasFilters =
    Boolean(searchQuery.trim()) ||
    monthFilter !== LEAD_MONTH_FILTER_ALL ||
    followUpFilter !== DEFAULT_LEAD_FOLLOW_UP_FILTER;

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return leadsDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all leads"
            disabled={isLoading || leads.length === 0}
          />
        ),
      },
      ...leadsDirectoryColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    isLoading,
    leads.length,
    onToggleAllVisible,
  ]);

  return (
    <DirectoryTable
      title={leadsDirectoryConfig.title}
      description={leadsDirectoryConfig.description}
      gridClass={
        canDelete ? LEADS_BULK_GRID_CLASS : leadsDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        hasFilters
          ? "No leads match those filters."
          : leadsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={leads.length === 0}
      headerAside={
        canDelete && onClearSelection && onBulkDelete ? (
          <DirectoryBulkDeleteBar
            selectedCount={selectedIds.length}
            singularLabel="lead"
            pluralLabel="leads"
            isDeleting={isDeleting}
            onClear={onClearSelection}
            onConfirmDelete={onBulkDelete}
          />
        ) : null
      }
      filters={
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="w-full min-w-0 sm:max-w-sm">
            <ListingSearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search leads"
              disabled={isLoading}
            />
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <LeadFollowUpFilterSelect
              value={followUpFilter}
              onChange={onFollowUpFilterChange}
              disabled={isLoading}
            />
            <LeadMonthFilter
              value={monthFilter}
              onChange={onMonthFilterChange}
              disabled={isLoading}
            />
            <LeadSortSelect
              value={sort}
              onChange={onSortChange}
              disabled={isLoading}
            />
          </div>
        </div>
      }
    >
      {leads.map((lead) => (
        <LeadsTableRow
          key={lead.id}
          lead={lead}
          nextFollowUp={getListingFollowUp(
            followUpsByLeadId.get(lead.id) ?? [],
            followUpFilter,
          )}
          canEdit={canEdit}
          canDelete={canDelete}
          selected={selectedSet.has(lead.id)}
          onToggleSelect={onToggleSelect}
          isSavingFollowUp={isSavingFollowUp}
          onEditLead={onEditLead}
          onUpdateFollowUpStatus={onUpdateFollowUpStatus}
          onRescheduleFollowUp={onRescheduleFollowUp}
        />
      ))}
    </DirectoryTable>
  );
}
